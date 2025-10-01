import { supabase } from '@/lib/supabaseClient';
import { Form, FormResponse, FormTemplate } from '@/components/dashboard/form-creation-wizard/types';

// DTO interfaces that match backend expectations
export interface CreateFormDto {
  title: string;
  description?: string;
  projectId: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';
  tags?: string[];
  category?: string;
  sections?: any[];
  settings?: any;
}

export interface UpdateFormDto {
  title?: string;
  description?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';
  tags?: string[];
  category?: string;
  sections?: any[];
  settings?: any;
}

export interface CreateFormResponseDto {
  formId: string;
  respondentId?: string;
  respondentEmail?: string;
  isComplete?: boolean;
  ipAddress?: string;
  userAgent?: string;
  source?: string;
  data: Record<string, any>;
}

export interface UpdateFormResponseDto {
  respondentEmail?: string;
  isComplete?: boolean;
  data?: Record<string, any>;
}

export interface CreateFormTemplateDto {
  name: string;
  description: string;
  category: string;
  tags?: string[];
  previewImage?: string;
  isPublic?: boolean;
  sections: any[];
  settings: any;
}

export const formsApi = {
  // ========================================
  // PROJECT FORM MANAGEMENT
  // ========================================

  async createForm(projectId: string, formData: CreateFormDto): Promise<Form> {
    console.log('🔧 FormsAPI.createForm: Starting form creation', { projectId, formData });
    
    // 1) Insert base form (no sections; normalized schema)
    const formId = crypto.randomUUID();
    const nowIso = new Date().toISOString();
    const basePayload = {
      id: formId,
      projectId,
      title: formData.title,
      description: formData.description || null,
      status: formData.status || 'DRAFT',
      tags: formData.tags || [],
      category: formData.category || null,
      settings: formData.settings || {},
      responseCount: 0,
      version: 1,
      createdBy: 'system',
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    console.log('🔧 FormsAPI.createForm: Base payload prepared', basePayload);

    const { data: createdForm, error: formErr } = await (supabase as any)
      .from('forms')
      .insert(basePayload)
      .select('*')
      .single();
    
    if (formErr) {
      console.error('❌ FormsAPI.createForm: Error creating base form', {
        error: formErr,
        code: formErr.code,
        message: formErr.message,
        details: formErr.details,
        hint: formErr.hint,
        payload: basePayload
      });
      throw formErr;
    }
    
    console.log('✅ FormsAPI.createForm: Base form created successfully', createdForm);

    // 2) Insert sections and questions, if provided
    const sections = formData.sections || [];
    console.log('🔧 FormsAPI.createForm: Processing sections', { sectionsCount: sections.length });
    
    for (let sIndex = 0; sIndex < sections.length; sIndex++) {
      const section = sections[sIndex];
      const sectionId = crypto.randomUUID();
      const sectionPayload = {
        id: sectionId,
        formId,
        title: section.title,
        description: section.description || null,
        order: section.order ?? sIndex,
        conditional: section.conditional || {},
      };
      
      console.log('🔧 FormsAPI.createForm: Creating section', { sectionIndex: sIndex, sectionPayload });
      
      const { error: secErr } = await (supabase as any)
        .from('form_sections')
        .insert(sectionPayload);
        
      if (secErr) {
        console.error('❌ FormsAPI.createForm: Error creating section', {
          sectionIndex: sIndex,
          error: secErr,
          code: secErr.code,
          message: secErr.message,
          details: secErr.details,
          hint: secErr.hint,
          payload: sectionPayload
        });
        throw secErr;
      }
      
      console.log('✅ FormsAPI.createForm: Section created successfully', { sectionIndex: sIndex, sectionId });

      const questions = section.questions || [];
      console.log('🔧 FormsAPI.createForm: Processing questions for section', { 
        sectionIndex: sIndex, 
        sectionId, 
        questionsCount: questions.length 
      });
      
      for (let qIndex = 0; qIndex < questions.length; qIndex++) {
        const q = questions[qIndex];
        const primaryLinked = (q.linkedActivities && q.linkedActivities.length > 0)
          ? q.linkedActivities[0]
          : null;
        const questionPayload = {
          id: q.id || crypto.randomUUID(),
          sectionId,
          type: q.type,
          title: q.title,
          description: q.description || null,
          order: q.order ?? qIndex,
          isRequired: !!q.isRequired,
          config: {
            ...(q.config || {}),
            options: q.options,
            statements: q.statements,
            linkedActivities: q.linkedActivities || [],
          },
          conditional: q.conditional || {},
          dbColumnName: q.dbColumnName || null,
          dbDataType: q.dbDataType || null,
          linkedActivityId: primaryLinked?.activityId || q.linkedActivityId || null,
          linkedOutcomeId: primaryLinked?.outcomeId || q.linkedOutcomeId || null,
          linkedKpiId: primaryLinked?.kpiContribution?.kpiId || q.linkedKpiId || null,
          kpiContribution: primaryLinked?.kpiContribution || q.kpiContribution || null,
        } as any;

        console.log('🔧 FormsAPI.createForm: Creating question', { 
          sectionIndex: sIndex, 
          questionIndex: qIndex, 
          questionPayload 
        });

        const { error: qErr } = await (supabase as any)
          .from('form_questions')
          .insert(questionPayload);
          
        if (qErr) {
          console.error('❌ FormsAPI.createForm: Error creating question', {
            sectionIndex: sIndex,
            questionIndex: qIndex,
            error: qErr,
            code: qErr.code,
            message: qErr.message,
            details: qErr.details,
            hint: qErr.hint,
            payload: questionPayload
          });
          throw qErr;
        }
        
        console.log('✅ FormsAPI.createForm: Question created successfully', { 
          sectionIndex: sIndex, 
          questionIndex: qIndex, 
          questionId: questionPayload.id 
        });
      }
    }

    // 3) Return fully hydrated form
    return await this.getForm(projectId, formId);
  },

  async getProjectForms(projectId: string): Promise<Form[]> {
    const { data, error } = await (supabase as any)
      .from('forms')
      .select('*')
      .eq('projectId', projectId)
      .order('createdAt', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapFormFromDb);
  },

  async getForm(projectId: string, formId: string): Promise<Form> {
    console.log('🔧 FormsAPI.getForm: Starting form fetch', { projectId, formId });
    
    // Base form
    const { data: formRow, error: formErr } = await (supabase as any)
      .from('forms')
      .select('*')
      .eq('id', formId)
      .eq('projectId', projectId)
      .single();
    
    if (formErr) {
      console.error('❌ FormsAPI.getForm: Error fetching base form', {
        formId,
        projectId,
        error: formErr,
        code: formErr.code,
        message: formErr.message,
        details: formErr.details,
        hint: formErr.hint,
      });
      throw formErr;
    }
    
    console.log('✅ FormsAPI.getForm: Base form fetched', formRow);

    // Sections
    const { data: sections, error: secErr } = await (supabase as any)
      .from('form_sections')
      .select('*')
      .eq('formId', formId)
      .order('order', { ascending: true });
    
    if (secErr) {
      console.error('❌ FormsAPI.getForm: Error fetching sections', {
        formId,
        error: secErr,
        code: secErr.code,
        message: secErr.message,
        details: secErr.details,
        hint: secErr.hint,
      });
      throw secErr;
    }
    
    console.log('✅ FormsAPI.getForm: Sections fetched', { sectionsCount: (sections || []).length });

    const sectionIds = (sections || []).map((s: any) => s.id);
    let questionsBySection: Record<string, any[]> = {};

    if (sectionIds.length > 0) {
      const { data: questions, error: qErr } = await (supabase as any)
        .from('form_questions')
        .select('*')
        .in('sectionId', sectionIds)
        .order('order', { ascending: true });
        
      if (qErr) {
        console.error('❌ FormsAPI.getForm: Error fetching questions', {
          formId,
          sectionIds,
          error: qErr,
          code: qErr.code,
          message: qErr.message,
          details: qErr.details,
          hint: qErr.hint,
        });
        throw qErr;
      }

      console.log('✅ FormsAPI.getForm: Questions fetched', { questionsCount: (questions || []).length });

      (questions || []).forEach((q: any) => {
        questionsBySection[q.sectionId] = questionsBySection[q.sectionId] || [];
        questionsBySection[q.sectionId].push(q);
      });
    }

    const mappedSections = (sections || []).map((s: any) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      order: s.order,
      conditional: s.conditional || {},
      questions: (questionsBySection[s.id] || []).map((q: any) => ({
        id: q.id,
        type: q.type,
        title: q.title,
        description: q.description,
        order: q.order,
        isRequired: q.isRequired,
        // Expand config back out for frontend
        ...(q.config || {}),
        config: undefined,
        conditional: q.conditional || {},
        dbColumnName: q.dbColumnName,
        dbDataType: q.dbDataType,
        // Backward-compatible links
        linkedActivityId: q.linkedActivityId,
        linkedOutcomeId: q.linkedOutcomeId,
        linkedKpiId: q.linkedKpiId,
        kpiContribution: q.kpiContribution,
        linkedActivities: (q.config?.linkedActivities) || [],
      }))
    }));

    console.log('✅ FormsAPI.getForm: Mapped sections', { sectionsCount: mappedSections.length });

    const base = mapFormFromDb(formRow);
    const result = { ...base, sections: mappedSections } as Form;
    
    console.log('✅ FormsAPI.getForm: Final form assembled', { 
      formId: result.id, 
      title: result.title, 
      sectionsCount: result.sections.length 
    });
    
    return result;
  },

  async updateForm(projectId: string, formId: string, updates: UpdateFormDto): Promise<Form> {
    const nowIso = new Date().toISOString();
    // 1) Update base form
    const updateData: any = { updatedAt: nowIso };
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.tags !== undefined) updateData.tags = updates.tags;
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.settings !== undefined) updateData.settings = updates.settings || {};

    console.log('🔧 FormsAPI.updateForm: Updating base form', { formId, projectId, updateData });
    const { error: upErr } = await (supabase as any)
      .from('forms')
      .update(updateData)
      .eq('id', formId)
      .eq('projectId', projectId);
    if (upErr) {
      console.error('❌ FormsAPI.updateForm: Error updating base form', {
        formId,
        projectId,
        error: upErr,
        code: upErr.code,
        message: upErr.message,
        details: upErr.details,
        hint: upErr.hint,
        payload: updateData,
      });
      throw upErr;
    }

    // 2) If sections provided, replace them (delete + recreate)
    if (updates.sections) {
      // Fetch existing section ids
      const { data: existingSections, error: exSecErr } = await (supabase as any)
        .from('form_sections')
        .select('id')
        .eq('formId', formId);
      if (exSecErr) {
        console.error('❌ FormsAPI.updateForm: Error fetching existing sections', exSecErr);
        throw exSecErr;
      }
      const existingIds = (existingSections || []).map((s: any) => s.id);

      if (existingIds.length > 0) {
        // Delete questions in those sections first
        const { error: delQErr } = await (supabase as any)
          .from('form_questions')
          .delete()
          .in('sectionId', existingIds);
        if (delQErr) {
          console.error('❌ FormsAPI.updateForm: Error deleting existing questions', delQErr);
          throw delQErr;
        }
        // Delete sections
        const { error: delSecErr } = await (supabase as any)
          .from('form_sections')
          .delete()
          .eq('formId', formId);
        if (delSecErr) {
          console.error('❌ FormsAPI.updateForm: Error deleting existing sections', delSecErr);
          throw delSecErr;
        }
      }

      // Recreate sections and questions
      for (let sIndex = 0; sIndex < updates.sections.length; sIndex++) {
        const section = updates.sections[sIndex];
        const sectionId = crypto.randomUUID();
        const { error: secErr } = await (supabase as any)
          .from('form_sections')
          .insert({
            id: sectionId,
            formId,
            title: section.title,
            description: section.description || null,
            order: section.order ?? sIndex,
            conditional: section.conditional || {},
          });
        if (secErr) throw secErr;

        const questions = section.questions || [];
        for (let qIndex = 0; qIndex < questions.length; qIndex++) {
          const q = questions[qIndex];
          const primaryLinked = (q.linkedActivities && q.linkedActivities.length > 0)
            ? q.linkedActivities[0]
            : null;
          const questionPayload = {
            id: q.id || crypto.randomUUID(),
            sectionId,
            type: q.type,
            title: q.title,
            description: q.description || null,
            order: q.order ?? qIndex,
            isRequired: !!q.isRequired,
            config: {
              ...(q.config || {}),
              options: q.options,
              statements: q.statements,
              linkedActivities: q.linkedActivities || [],
            },
            conditional: q.conditional || {},
            dbColumnName: q.dbColumnName || null,
            dbDataType: q.dbDataType || null,
            linkedActivityId: primaryLinked?.activityId || q.linkedActivityId || null,
            linkedOutcomeId: primaryLinked?.outcomeId || q.linkedOutcomeId || null,
            linkedKpiId: primaryLinked?.kpiContribution?.kpiId || q.linkedKpiId || null,
            kpiContribution: primaryLinked?.kpiContribution || q.kpiContribution || null,
          } as any;

          const { error: qErr } = await (supabase as any)
            .from('form_questions')
            .insert(questionPayload);
          if (qErr) {
            console.error('❌ FormsAPI.updateForm: Error creating question', {
              sectionIndex: sIndex,
              questionIndex: qIndex,
              error: qErr,
              payload: questionPayload,
            });
            throw qErr;
          }
        }
      }
    }

    // 3) Return hydrated
    return await this.getForm(projectId, formId);
  },

  async deleteForm(projectId: string, formId: string): Promise<void> {
    const { error } = await (supabase as any)
      .from('forms')
      .delete()
      .eq('id', formId)
      .eq('projectId', projectId);
    if (error) throw error;
  },

  async duplicateForm(projectId: string, formId: string): Promise<Form> {
    console.log('🌐 FormsAPI: Making duplicate request for project:', projectId, 'formId:', formId);
    
    // First get the original form
    const originalForm = await this.getForm(projectId, formId);
    
    // Create a duplicate with new ID and title
    const duplicateData: CreateFormDto = {
      title: `${originalForm.title} (Copy)`,
      description: originalForm.description,
      projectId,
      status: 'DRAFT',
      tags: originalForm.tags || [],
      category: originalForm.category,
      sections: originalForm.sections || [],
      settings: originalForm.settings || {},
    };
    
    const duplicatedForm = await this.createForm(projectId, duplicateData);
    
    console.log('📋 FormsAPI: Duplicated form structure:', {
      id: duplicatedForm.id,
      title: duplicatedForm.title,
      sectionsCount: duplicatedForm.sections?.length || 0,
      totalQuestions: duplicatedForm.sections?.reduce((total, section) => total + (section.questions?.length || 0), 0) || 0
    });
    
    return duplicatedForm;
  },

  // ========================================
  // FORM RESPONSES
  // ========================================

  async submitResponse(responseData: CreateFormResponseDto): Promise<FormResponse> {
    console.log('🔧 FormsAPI.submitResponse: Starting submission', { responseData });

    // 0) Fetch form to get version
    const { data: formRow, error: formErr } = await (supabase as any)
      .from('forms')
      .select('id, version')
      .eq('id', responseData.formId)
      .single();
    if (formErr) {
      console.error('❌ FormsAPI.submitResponse: Error fetching form for version', formErr);
      throw formErr;
    }

    // 1) Insert base response
    const responseId = crypto.randomUUID();
    const basePayload = {
      id: responseId,
      formId: responseData.formId,
      formVersion: formRow.version,
      respondentId: responseData.respondentId || null,
      respondentEmail: responseData.respondentEmail || null,
      isComplete: !!responseData.isComplete,
      ipAddress: responseData.ipAddress || null,
      userAgent: responseData.userAgent || null,
      source: responseData.source || null,
      submittedAt: responseData.isComplete ? new Date().toISOString() : null,
    } as any;

    console.log('🔧 FormsAPI.submitResponse: Inserting base response', basePayload);
    const { data: baseResp, error: baseErr } = await (supabase as any)
      .from('form_responses')
      .insert(basePayload)
      .select('*')
      .single();
    if (baseErr) {
      console.error('❌ FormsAPI.submitResponse: Error inserting base response', { error: baseErr, payload: basePayload });
      throw baseErr;
    }
    console.log('✅ FormsAPI.submitResponse: Base response inserted', baseResp);

    // 2) Insert question responses
    const entries = Object.entries(responseData.data || {});
    if (entries.length > 0) {
      const qrPayloads = entries.map(([questionId, value]) => ({
        id: crypto.randomUUID(),
        responseId,
        questionId,
        value: value as any,
      }));
      console.log('🔧 FormsAPI.submitResponse: Inserting question responses', { count: qrPayloads.length });
      const { error: qrErr } = await (supabase as any)
        .from('form_question_responses')
        .insert(qrPayloads);
      if (qrErr) {
        console.error('❌ FormsAPI.submitResponse: Error inserting question responses', qrErr);
        throw qrErr;
      }
      console.log('✅ FormsAPI.submitResponse: Question responses inserted', { inserted: qrPayloads.length });
    }

    // 3) Update form response count
    console.log('🔧 FormsAPI.submitResponse: Updating form response count');
    const { error: countErr } = await (supabase as any)
      .from('forms')
      .update({ 
        responseCount: (formRow.responseCount || 0) + 1,
        lastResponseAt: new Date().toISOString()
      })
      .eq('id', responseData.formId);
    
    if (countErr) {
      console.warn('⚠️ FormsAPI.submitResponse: Failed to update response count', countErr);
    } else {
      console.log('✅ FormsAPI.submitResponse: Response count updated');
    }

    // 4) Verify and return mapped
    const { data: verifyResp, error: verifyErr } = await (supabase as any)
      .from('form_responses')
      .select('*')
      .eq('id', responseId)
      .single();
    if (verifyErr) {
      console.warn('⚠️ FormsAPI.submitResponse: Verification fetch failed', verifyErr);
    }

    return mapFormResponseFromDb({
      ...baseResp,
      questionResponses: entries.map(([questionId, value]) => ({ questionId, value })),
    });
  },

  async getFormResponses(projectId: string, formId: string): Promise<FormResponse[]> {
    console.log('🔧 FormsAPI.getFormResponses: Fetching responses', { projectId, formId });
    const { data: responses, error } = await (supabase as any)
      .from('form_responses')
      .select('*')
      .eq('formId', formId)
      .order('startedAt', { ascending: false });
    if (error) {
      console.error('❌ FormsAPI.getFormResponses: Error fetching base responses', error);
      throw error;
    }

    const responseIds = (responses || []).map((r: any) => r.id);
    let grouped: Record<string, any[]> = {};
    if (responseIds.length > 0) {
      const { data: qrs, error: qrErr } = await (supabase as any)
        .from('form_question_responses')
        .select('*')
        .in('responseId', responseIds);
      if (qrErr) {
        console.error('❌ FormsAPI.getFormResponses: Error fetching question responses', qrErr);
        throw qrErr;
      }
      (qrs || []).forEach((qr: any) => {
        grouped[qr.responseId] = grouped[qr.responseId] || [];
        grouped[qr.responseId].push(qr);
      });
    }

    const result = (responses || []).map((r: any) =>
      mapFormResponseFromDb({ ...r, questionResponses: grouped[r.id] || [] })
    );
    console.log('✅ FormsAPI.getFormResponses: Assembled responses', { count: result.length });
    return result;
  },

  async getFormResponse(projectId: string, formId: string, responseId: string): Promise<FormResponse> {
    console.log('🔧 FormsAPI.getFormResponse: Fetching single response', { projectId, formId, responseId });
    const { data: resp, error } = await (supabase as any)
      .from('form_responses')
      .select('*')
      .eq('id', responseId)
      .eq('formId', formId)
      .single();
    if (error) {
      console.error('❌ FormsAPI.getFormResponse: Error fetching base response', error);
      throw error;
    }
    const { data: qrs, error: qrErr } = await (supabase as any)
      .from('form_question_responses')
      .select('*')
      .eq('responseId', responseId);
    if (qrErr) {
      console.error('❌ FormsAPI.getFormResponse: Error fetching question responses', qrErr);
      throw qrErr;
    }
    const result = mapFormResponseFromDb({ ...resp, questionResponses: qrs || [] });
    console.log('✅ FormsAPI.getFormResponse: Assembled response');
    return result;
  },

  async updateFormResponse(projectId: string, formId: string, responseId: string, updates: UpdateFormResponseDto): Promise<FormResponse> {
    const updateData = {
      respondentEmail: updates.respondentEmail,
      isComplete: updates.isComplete,
      data: updates.data,
      updatedBy: 'system',
      updatedAt: new Date().toISOString(),
    };
    const { data, error } = await (supabase as any)
      .from('form_responses')
      .update(updateData)
      .eq('id', responseId)
      .eq('formId', formId)
      .select('*')
      .single();
    if (error) throw error;
    return mapFormResponseFromDb(data);
  },

  async deleteFormResponse(projectId: string, formId: string, responseId: string): Promise<void> {
    console.log('🔧 FormsAPI.deleteFormResponse: Deleting response', { projectId, formId, responseId });
    
    // Delete the response
    const { error } = await (supabase as any)
      .from('form_responses')
      .delete()
      .eq('id', responseId)
      .eq('formId', formId);
    if (error) {
      console.error('❌ FormsAPI.deleteFormResponse: Error deleting response', error);
      throw error;
    }
    
    // Update form response count
    console.log('🔧 FormsAPI.deleteFormResponse: Updating form response count');
    const { error: countErr } = await (supabase as any)
      .from('forms')
      .update({ 
        responseCount: (await (supabase as any)
          .from('forms')
          .select('responseCount')
          .eq('id', formId)
          .single()
        ).data?.responseCount - 1 || 0
      })
      .eq('id', formId);
    
    if (countErr) {
      console.warn('⚠️ FormsAPI.deleteFormResponse: Failed to update response count', countErr);
    } else {
      console.log('✅ FormsAPI.deleteFormResponse: Response count updated');
    }
  },

  // ========================================
  // FORM REFRESH
  // ========================================

  async refreshFormStats(formId: string): Promise<{ responseCount: number; lastResponseAt: string | null }> {
    console.log('🔧 FormsAPI.refreshFormStats: Refreshing form stats', { formId });
    
    // Get current response count and last response time
    const { data: responses, error } = await (supabase as any)
      .from('form_responses')
      .select('id, startedAt')
      .eq('formId', formId)
      .order('startedAt', { ascending: false });
    
    if (error) {
      console.error('❌ FormsAPI.refreshFormStats: Error fetching responses', error);
      throw error;
    }
    
    const responseCount = responses?.length || 0;
    const lastResponseAt = responses?.[0]?.startedAt || null;
    
    // Update the form with current stats
    const { error: updateErr } = await (supabase as any)
      .from('forms')
      .update({ 
        responseCount,
        lastResponseAt
      })
      .eq('id', formId);
    
    if (updateErr) {
      console.error('❌ FormsAPI.refreshFormStats: Error updating form stats', updateErr);
      throw updateErr;
    }
    
    console.log('✅ FormsAPI.refreshFormStats: Form stats updated', { responseCount, lastResponseAt });
    return { responseCount, lastResponseAt };
  },

  // ========================================
  // FORM ANALYTICS
  // ========================================

  async getFormAnalytics(projectId: string, formId: string): Promise<any> {
    // Get response count and completion rate
    const { data: responses, error: responsesError } = await (supabase as any)
      .from('form_responses')
      .select('id, isComplete')
      .eq('formId', formId);
    
    if (responsesError) throw responsesError;
    
    const totalResponses = responses?.length || 0;
    const completedResponses = responses?.filter((r: any) => r.isComplete).length || 0;
    const completionRate = totalResponses > 0 ? (completedResponses / totalResponses) * 100 : 0;
    
    return {
      totalResponses,
      completedResponses,
      completionRate: Math.round(completionRate * 100) / 100,
      lastResponseAt: responses?.[0]?.createdAt || null,
    };
  },

  // ========================================
  // FORM TEMPLATES
  // ========================================

  async createTemplate(templateData: CreateFormTemplateDto): Promise<FormTemplate> {
    const payload = {
      id: crypto.randomUUID(),
      name: templateData.name,
      description: templateData.description,
      category: templateData.category,
      tags: templateData.tags || [],
      previewImage: templateData.previewImage || null,
      isPublic: templateData.isPublic || false,
      sections: templateData.sections || [],
      settings: templateData.settings || {},
      createdBy: 'system',
      updatedBy: 'system',
      updatedAt: new Date().toISOString(),
    };
    const { data, error } = await (supabase as any)
      .from('form_templates')
      .insert(payload)
      .select('*')
      .single();
    if (error) throw error;
    return mapFormTemplateFromDb(data);
  },

  async getPublicTemplates(): Promise<FormTemplate[]> {
    const { data, error } = await (supabase as any)
      .from('form_templates')
      .select('*')
      .eq('isPublic', true)
      .order('createdAt', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapFormTemplateFromDb);
  },

  async getUserTemplates(): Promise<FormTemplate[]> {
    const { data, error } = await (supabase as any)
      .from('form_templates')
      .select('*')
      .eq('createdBy', 'system')
      .order('createdAt', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapFormTemplateFromDb);
  },

  async createFormFromTemplate(projectId: string, templateId: string, title: string): Promise<Form> {
    // Get the template first
    const { data: template, error: templateError } = await (supabase as any)
      .from('form_templates')
      .select('*')
      .eq('id', templateId)
      .single();
    
    if (templateError) throw templateError;
    
    // Create form from template
    const formData: CreateFormDto = {
      title,
      description: template.description,
      projectId,
      status: 'DRAFT',
      tags: template.tags || [],
      category: template.category,
      sections: template.sections || [],
      settings: template.settings || {},
    };
    
    return await this.createForm(projectId, formData);
  },

  // ========================================
  // MEDIA ATTACHMENTS
  // ========================================

  async uploadMediaFile(
    projectId: string,
    formId: string,
    file: File,
    questionId: string,
    responseId: string,
    metadata: {
      tags?: string[];
      description?: string;
      location?: {
        latitude: number;
        longitude: number;
        accuracy?: number;
        address?: string;
      };
    }
  ): Promise<any> {
    // Upload to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `forms/${projectId}/${formId}/${fileName}`;
    
    const { data: uploadData, error: uploadError } = await (supabase as any).storage
      .from('media')
      .upload(filePath, file);
    
    if (uploadError) throw uploadError;
    
    // Get public URL
    const { data: urlData } = (supabase as any).storage
      .from('media')
      .getPublicUrl(filePath);
    
    // Store metadata in database
    const payload = {
      id: crypto.randomUUID(),
      projectId,
      formId,
      questionId,
      responseId: responseId || null,
      fileName: file.name,
      filePath,
      fileUrl: urlData.publicUrl,
      fileSize: file.size,
      mimeType: file.type,
      tags: metadata.tags || [],
      description: metadata.description || null,
      location: metadata.location || null,
      createdBy: 'system',
      updatedBy: 'system',
      updatedAt: new Date().toISOString(),
    };
    
    const { data, error } = await (supabase as any)
      .from('form_media')
      .insert(payload)
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  },

  async uploadDirectMediaFile(
    projectId: string,
    file: File,
    description?: string,
    tags?: string
  ): Promise<any> {
    // Upload to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `media/${projectId}/${fileName}`;
    
    const { data: uploadData, error: uploadError } = await (supabase as any).storage
      .from('media')
      .upload(filePath, file);
    
    if (uploadError) throw uploadError;
    
    // Get public URL
    const { data: urlData } = (supabase as any).storage
      .from('media')
      .getPublicUrl(filePath);
    
    // Store metadata in database
    const payload = {
      id: crypto.randomUUID(),
      projectId,
      fileName: file.name,
      filePath,
      fileUrl: urlData.publicUrl,
      fileSize: file.size,
      mimeType: file.type,
      description: description || null,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      createdBy: 'system',
      updatedBy: 'system',
      updatedAt: new Date().toISOString(),
    };
    
    const { data, error } = await (supabase as any)
      .from('project_media')
      .insert(payload)
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  },

  async getFormMediaFiles(projectId: string, formId: string): Promise<any[]> {
    const { data, error } = await (supabase as any)
      .from('form_media')
      .select('*')
      .eq('projectId', projectId)
      .eq('formId', formId)
      .order('createdAt', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getProjectMediaFiles(projectId: string, search?: string, mediaType?: string): Promise<any[]> {
    let query = (supabase as any)
      .from('project_media')
      .select('*')
      .eq('projectId', projectId);
    
    if (search) {
      query = query.or(`fileName.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    if (mediaType) {
      query = query.eq('mimeType', mediaType);
    }
    
    const { data, error } = await query.order('createdAt', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async deleteMediaFile(projectId: string, formId: string, mediaId: string): Promise<void> {
    // Get file info first
    const { data: fileData, error: fetchError } = await (supabase as any)
      .from('form_media')
      .select('filePath')
      .eq('id', mediaId)
      .eq('projectId', projectId)
      .eq('formId', formId)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Delete from storage
    const { error: storageError } = await (supabase as any).storage
      .from('media')
      .remove([fileData.filePath]);
    
    if (storageError) throw storageError;
    
    // Delete from database
    const { error: dbError } = await (supabase as any)
      .from('form_media')
      .delete()
      .eq('id', mediaId)
      .eq('projectId', projectId)
      .eq('formId', formId);
    
    if (dbError) throw dbError;
  },

  async updateMediaFileMetadata(projectId: string, formId: string, mediaId: string, updates: any): Promise<any> {
    const updateData = {
      ...updates,
      updatedBy: 'system',
      updatedAt: new Date().toISOString(),
    };
    const { data, error } = await (supabase as any)
      .from('form_media')
      .update(updateData)
      .eq('id', mediaId)
      .eq('projectId', projectId)
      .eq('formId', formId)
      .select('*')
      .single();
    if (error) throw error;
    return data;
  },

  // ========================================
  // PUBLIC FORM ACCESS
  // ========================================

  async getPublicForm(formId: string): Promise<Form> {
    console.log('🔧 FormsAPI.getPublicForm: Starting public form fetch', { formId });
    
    const { data, error } = await (supabase as any)
      .from('forms')
      .select('*')
      .eq('id', formId)
      .eq('status', 'PUBLISHED')
      .single();
    
    if (error) {
      console.error('❌ FormsAPI.getPublicForm: Error fetching public form', {
        formId,
        error,
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      throw error;
    }
    
    console.log('✅ FormsAPI.getPublicForm: Base form fetched', data);
    
    // Fetch sections and questions for public form
    const { data: sections, error: secErr } = await (supabase as any)
      .from('form_sections')
      .select('*')
      .eq('formId', formId)
      .order('order', { ascending: true });
    
    if (secErr) {
      console.error('❌ FormsAPI.getPublicForm: Error fetching sections', secErr);
      throw secErr;
    }
    
    console.log('✅ FormsAPI.getPublicForm: Sections fetched', { sectionsCount: (sections || []).length });

    const sectionIds = (sections || []).map((s: any) => s.id);
    let questionsBySection: Record<string, any[]> = {};

    if (sectionIds.length > 0) {
      const { data: questions, error: qErr } = await (supabase as any)
        .from('form_questions')
        .select('*')
        .in('sectionId', sectionIds)
        .order('order', { ascending: true });
        
      if (qErr) {
        console.error('❌ FormsAPI.getPublicForm: Error fetching questions', qErr);
        throw qErr;
      }

      console.log('✅ FormsAPI.getPublicForm: Questions fetched', { questionsCount: (questions || []).length });

      (questions || []).forEach((q: any) => {
        questionsBySection[q.sectionId] = questionsBySection[q.sectionId] || [];
        questionsBySection[q.sectionId].push(q);
      });
    }

    const mappedSections = (sections || []).map((s: any) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      order: s.order,
      conditional: s.conditional || {},
      questions: (questionsBySection[s.id] || []).map((q: any) => ({
        id: q.id,
        type: q.type,
        title: q.title,
        description: q.description,
        order: q.order,
        isRequired: q.isRequired,
        // Expand config back out for frontend
        ...(q.config || {}),
        config: undefined,
        conditional: q.conditional || {},
        dbColumnName: q.dbColumnName,
        dbDataType: q.dbDataType,
        // Backward-compatible links
        linkedActivityId: q.linkedActivityId,
        linkedOutcomeId: q.linkedOutcomeId,
        linkedKpiId: q.linkedKpiId,
        kpiContribution: q.kpiContribution,
        linkedActivities: (q.config?.linkedActivities) || [],
      }))
    }));

    console.log('✅ FormsAPI.getPublicForm: Mapped sections', { sectionsCount: mappedSections.length });

    const base = mapFormFromDb(data);
    const result = { ...base, sections: mappedSections } as Form;
    
    console.log('✅ FormsAPI.getPublicForm: Final form assembled', { 
      formId: result.id, 
      title: result.title, 
      sectionsCount: result.sections.length 
    });
    
    return result;
  },

  async getSecureForm(formId: string): Promise<Form> {
    const { data, error } = await (supabase as any)
      .from('forms')
      .select('*')
      .eq('id', formId)
      .single();
    if (error) throw error;
    return mapFormFromDb(data);
  },

  // ========================================
  // UTILITY METHODS
  // ========================================

  async getFormByIdOnly(formId: string): Promise<Form | null> {
    try {
      // Try secure first (authenticated access)
        try {
          return await this.getSecureForm(formId);
        } catch {
          // Fallback to public endpoint
      return await this.getPublicForm(formId);
      }
    } catch (error) {
      console.error('Error fetching form:', error);
      return null;
    }
  },

  async getAllUserForms(): Promise<Form[]> {
    try {
      const { data, error } = await (supabase as any)
        .from('forms')
        .select('*')
        .order('createdAt', { ascending: false });
      if (error) throw error;
      return (data || []).map(mapFormFromDb);
    } catch (error) {
      console.error('Error fetching user forms:', error);
      return [];
    }
  },

  // ========================================
  // OFFLINE SUPPORT UTILITIES
  // ========================================

  async syncOfflineData(offlineQueue: any[]): Promise<{ success: boolean; failedItems: any[] }> {
    const failedItems: any[] = [];
    
    for (const item of offlineQueue) {
      try {
        switch (item.type) {
          case 'form_create':
            await this.createForm(item.data.projectId, item.data);
            break;
          case 'form_update':
            await this.updateForm(item.data.projectId, item.data.id, item.data);
            break;
          case 'form_response':
            await this.submitResponse(item.data);
            break;
          case 'form_delete':
            await this.deleteForm(item.data.projectId, item.data.id);
            break;
          default:
            console.warn('Unknown offline queue item type:', item.type);
        }
      } catch (error) {
        console.error('Failed to sync offline item:', item, error);
        failedItems.push(item);
      }
    }

    return {
      success: failedItems.length === 0,
      failedItems
    };
  }
};

// Helper functions to map database rows to frontend types
function mapFormFromDb(row: any): Form {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    projectId: row.projectId,
    status: row.status,
    tags: row.tags || [],
    category: row.category,
    sections: row.sections || [],
    settings: row.settings || {},
    version: row.version || 1,
    responseCount: row.responseCount || 0,
    createdAt: row.createdAt ? new Date(row.createdAt) : new Date(),
    updatedAt: row.updatedAt ? new Date(row.updatedAt) : new Date(),
    createdBy: row.createdBy,
  };
}

function mapFormResponseFromDb(row: any): FormResponse {
  return {
    id: row.id,
    formId: row.formId,
    respondentId: row.respondentId,
    respondentEmail: row.respondentEmail,
    isComplete: row.isComplete,
    ipAddress: row.ipAddress,
    userAgent: row.userAgent,
    source: row.source,
    data: (row.questionResponses || []).reduce((acc: any, qr: any) => {
      acc[qr.questionId] = qr.value;
      return acc;
    }, {}),
    formVersion: row.formVersion || 1,
    startedAt: row.startedAt ? new Date(row.startedAt) : new Date(),
  };
}

function mapFormTemplateFromDb(row: any): FormTemplate {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category,
    tags: row.tags || [],
    previewImage: row.previewImage,
    isPublic: row.isPublic,
    sections: row.sections || [],
    settings: row.settings || {},
    usageCount: row.usageCount || 0,
    createdAt: row.createdAt ? new Date(row.createdAt) : new Date(),
    createdBy: row.createdBy,
  };
}
