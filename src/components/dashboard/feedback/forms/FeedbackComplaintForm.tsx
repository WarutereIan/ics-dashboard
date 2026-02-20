import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { MapPin, Phone, Paperclip, X } from 'lucide-react';
import {
  SOP_CATEGORY_DESCRIPTIONS,
  type SopCategory,
} from '@/types/feedback';

export interface ProjectOption {
  id: string;
  name: string;
}

interface FeedbackComplaintFormProps {
  onSubmit: (data: Record<string, unknown>) => void;
  isSubmitting: boolean;
  projects: ProjectOption[];
}

const SOP_CATEGORIES: SopCategory[] = [1, 2, 3, 4, 5, 6, 7, 8];

export function FeedbackComplaintForm({
  onSubmit,
  isSubmitting,
  projects = [],
}: FeedbackComplaintFormProps) {
  const [formData, setFormData] = useState({
    isAnonymous: false,
    name: '',
    sex: '' as '' | 'male' | 'female',
    age: '' as '' | 'child' | 'adult',
    phone: '',
    county: '',
    subCounty: '',
    village: '',
    projectId: '',
    description: '',
    category: null as SopCategory | null,
    attachments: [] as File[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }));
  };

  const removeAttachment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!formData.description.trim()) next.description = 'Description of complaint/feedback is required.';
    if (formData.category == null) next.category = 'Please select a complaint category.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const now = new Date();
    onSubmit({
      ...formData,
      date: now.toISOString().slice(0, 10),
      time: now.toTimeString().slice(0, 5),
      submitterName: formData.name.trim() || undefined,
      submitterEmail: undefined,
      stakeholderType: undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Optional complainant details – for anonymous leave blank */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your details (optional)</CardTitle>
          <p className="text-sm text-muted-foreground">
            You may submit anonymously. If you provide contact details, we may use them to follow up.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="anonymous"
              checked={formData.isAnonymous}
              onCheckedChange={(c) => handleChange('isAnonymous', c === true)}
            />
            <Label htmlFor="anonymous">Submit anonymously</Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name {formData.isAnonymous ? '(optional – leave blank to remain anonymous)' : ''}</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>
          {!formData.isAnonymous && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Sex</Label>
                  <Select
                    value={formData.sex}
                    onValueChange={(v) => handleChange('sex', v as 'male' | 'female')}
                  >
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Age</Label>
                  <Select
                    value={formData.age}
                    onValueChange={(v) => handleChange('age', v as 'child' | 'adult')}
                  >
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="child">Child (under 18)</SelectItem>
                      <SelectItem value="adult">Adult (18 and above)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  Phone number (if permitted and available)
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Optional"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="w-4 h-4" />
            Location (optional)
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="county">County</Label>
            <Input
              id="county"
              value={formData.county}
              onChange={(e) => handleChange('county', e.target.value)}
              placeholder="Optional"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subCounty">Sub County</Label>
            <Input
              id="subCounty"
              value={formData.subCounty}
              onChange={(e) => handleChange('subCounty', e.target.value)}
              placeholder="Optional"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="village">Village</Label>
            <Input
              id="village"
              value={formData.village}
              onChange={(e) => handleChange('village', e.target.value)}
              placeholder="Optional"
            />
          </div>
        </CardContent>
      </Card>

      {/* Project the complaint/feedback is related to */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Project (optional)</CardTitle>
          <p className="text-sm text-muted-foreground">
            Name of project the complaint/feedback is related to
          </p>
        </CardHeader>
        <CardContent>
          <Select
            value={formData.projectId || '_none'}
            onValueChange={(v) => handleChange('projectId', v === '_none' ? '' : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select project if applicable" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_none">Not related to a specific project / General</SelectItem>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Description of complaint/feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Description of complaint/feedback *</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Please describe your complaint or feedback in detail..."
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={5}
            className={errors.description ? 'border-red-500' : ''}
          />
          {errors.description && (
            <p className="text-sm text-red-600 mt-1">{errors.description}</p>
          )}
        </CardContent>
      </Card>

      {/* Complaint Category (SOP) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Complaint category *</CardTitle>
          <p className="text-sm text-muted-foreground">Select the category that best matches your feedback</p>
        </CardHeader>
        <CardContent>
          <Select
            value={formData.category != null ? String(formData.category) : ''}
            onValueChange={(v) => handleChange('category', v ? (Number(v) as SopCategory) : null)}
          >
            <SelectTrigger
              className={`w-full min-w-0 ${errors.category ? 'border-red-500' : ''}`}
            >
              <SelectValue placeholder="Select category..." />
            </SelectTrigger>
            <SelectContent
              className="min-w-[var(--radix-select-trigger-width)] w-max max-w-[min(90vw,28rem)]"
              position="popper"
            >
              {SOP_CATEGORIES.map((num) => (
                <SelectItem
                  key={num}
                  value={String(num)}
                  className="whitespace-normal break-words py-2 pr-8 text-left"
                >
                  Category {num}: {SOP_CATEGORY_DESCRIPTIONS[num]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-sm text-red-600 mt-1">{errors.category}</p>
          )}
        </CardContent>
      </Card>

      {/* Optional attachments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Paperclip className="w-4 h-4" />
            Attachments (optional)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input
            type="file"
            multiple
            onChange={handleFileChange}
            className="cursor-pointer"
          />
          {formData.attachments.length > 0 && (
            <ul className="text-sm text-muted-foreground space-y-1 mt-2">
              {formData.attachments.map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="truncate">{f.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => removeAttachment(i)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit feedback'}
        </Button>
      </div>
    </form>
  );
}
