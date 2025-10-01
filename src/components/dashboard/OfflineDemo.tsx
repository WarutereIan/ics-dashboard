import React from 'react';
import { useForm } from '@/contexts/FormContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlusIcon, TrashIcon, ArrowPathIcon, DocumentTextIcon, UserIcon } from '@heroicons/react/24/outline';
import { Wifi, WifiOff, Image } from 'lucide-react';


export function OfflineDemo() {
  const {
    isOnline,
    syncStatus,
    addToOfflineQueue,
    processOfflineQueue,
    retryFailedItems,
    clearOfflineQueue,
    getOfflineQueue,
    getFailedItems
  } = useForm();

  const queue = getOfflineQueue();
  const failedItems = getFailedItems();

  const addTestFormResponse = () => {
    addToOfflineQueue('form_response', {
      id: `test_response_${Date.now()}`,
      formId: 'test-form',
      responses: { question1: 'Test answer' },
      submittedAt: new Date(),
      isComplete: true
    });
  };

  const addTestFormCreate = () => {
    addToOfflineQueue('form_create', {
      id: `test_form_${Date.now()}`,
      title: 'Test Form',
      description: 'A test form created offline',
      questions: [],
      createdAt: new Date()
    });
  };

  const addTestMediaUpload = () => {
    addToOfflineQueue('media_upload', {
      id: `test_media_${Date.now()}`,
      fileName: 'test-image.jpg',
      fileSize: 1024 * 1024,
      mediaType: 'image',
      uploadedAt: new Date()
    });
  };

  const simulateOfflineMode = () => {
    // This is just for demo purposes - in real app, this would be controlled by network status
    window.dispatchEvent(new Event('offline'));
  };

  const simulateOnlineMode = () => {
    // This is just for demo purposes - in real app, this would be controlled by network status
    window.dispatchEvent(new Event('online'));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wifi className="w-5 h-5" />
            <span>Offline Demo</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge variant={isOnline ? "default" : "secondary"}>
                {isOnline ? "Online" : "Offline"}
              </Badge>
              <span className="text-sm text-gray-600">
                Current Status: {isOnline ? "Connected" : "Disconnected"}
              </span>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" onClick={simulateOfflineMode}>
                <WifiOff className="w-4 h-4 mr-2" />
                Go Offline
              </Button>
              <Button size="sm" variant="outline" onClick={simulateOnlineMode}>
                <Wifi className="w-4 h-4 mr-2" />
                Go Online
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{syncStatus.pendingItems}</div>
              <div className="text-sm text-gray-600">Pending Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{syncStatus.failedItems}</div>
              <div className="text-sm text-gray-600">Failed Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{queue.length}</div>
              <div className="text-sm text-gray-600">Total Queue</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add Test Items to Queue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              onClick={addTestFormResponse}
              className="flex items-center space-x-2"
            >
              <DocumentTextIcon className="w-4 h-4" />
              <span>Add Form Response</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={addTestFormCreate}
              className="flex items-center space-x-2"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Add Form Create</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={addTestMediaUpload}
              className="flex items-center space-x-2"
            >
              <Image className="w-4 h-4" />
              <span>Add Media Upload</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Queue Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Button 
              onClick={processOfflineQueue}
              disabled={syncStatus.isSyncing || !isOnline}
              className="flex items-center space-x-2"
            >
              <ArrowPathIcon className="w-4 h-4" />
              <span>Process Queue</span>
            </Button>
            
            <Button 
              variant="outline"
              onClick={retryFailedItems}
              disabled={failedItems.length === 0}
              className="flex items-center space-x-2"
            >
              <ArrowPathIcon className="w-4 h-4" />
              <span>Retry Failed</span>
            </Button>
            
            <Button 
              variant="outline"
              onClick={clearOfflineQueue}
              disabled={queue.length === 0}
              className="flex items-center space-x-2"
            >
              <TrashIcon className="w-4 h-4" />
              <span>Clear Queue</span>
            </Button>
          </div>

          {queue.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Current Queue Items:</h4>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {queue.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="capitalize">{item.type.replace('_', ' ')}</span>
                      <span className="text-gray-500">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {item.retryCount > 0 && (
                        <Badge variant="outline" className="text-xs">
                          Retry {item.retryCount}/{item.maxRetries}
                        </Badge>
                      )}
                      {item.retryCount >= item.maxRetries && (
                        <Badge variant="destructive" className="text-xs">
                          Failed
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sync Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Online Status:</span>
              <Badge variant={isOnline ? "default" : "secondary"}>
                {isOnline ? "Online" : "Offline"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Sync Status:</span>
              <Badge variant={syncStatus.isSyncing ? "default" : "outline"}>
                {syncStatus.isSyncing ? "Syncing..." : "Idle"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Last Sync:</span>
              <span>
                {syncStatus.lastSyncTime 
                  ? syncStatus.lastSyncTime.toLocaleString() 
                  : "Never"
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span>Sync Progress:</span>
              <span>{Math.round(syncStatus.syncProgress)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


