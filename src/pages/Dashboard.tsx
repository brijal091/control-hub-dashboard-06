
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { 
  LightbulbIcon, 
  Fan, 
  Thermometer, 
  Plug, 
  Power, 
  Plus
} from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { IoTDevice } from '@/types';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// Mock device data (would typically come from API)
const initialDevices: IoTDevice[] = [
  {
    id: '1',
    name: 'Living Room Light',
    type: 'switch',
    status: false,
    x: 0,
    y: 0,
    icon: 'LightbulbIcon',
    organizationId: '1',
  },
  {
    id: '2',
    name: 'Kitchen Fan',
    type: 'switch',
    status: true,
    x: 1,
    y: 0,
    icon: 'Fan',
    organizationId: '1',
  },
  {
    id: '3',
    name: 'Bedroom Thermostat',
    type: 'slider',
    status: true,
    value: 72,
    min: 60,
    max: 85,
    x: 0,
    y: 1,
    icon: 'Thermometer',
    organizationId: '1',
  },
  {
    id: '4',
    name: 'TV Socket',
    type: 'switch',
    status: true,
    x: 1,
    y: 1,
    icon: 'Plug',
    organizationId: '1',
  },
];

// Helper function to get the appropriate icon component
const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'LightbulbIcon':
      return <LightbulbIcon className="h-5 w-5" />;
    case 'Fan':
      return <Fan className="h-5 w-5" />;
    case 'Thermometer':
      return <Thermometer className="h-5 w-5" />;
    case 'Plug':
      return <Plug className="h-5 w-5" />;
    default:
      return <Power className="h-5 w-5" />;
  }
};

// Device Card Component
const DeviceCard: React.FC<{
  device: IoTDevice;
  onToggle: (id: string, status: boolean) => void;
  onValueChange?: (id: string, value: number) => void;
}> = ({ device, onToggle, onValueChange }) => {
  const handleToggle = () => {
    onToggle(device.id, !device.status);
  };

  return (
    <Card className={`iot-card ${device.status ? 'iot-card-active' : ''}`}>
      <CardHeader className="iot-card-header">
        <div className="flex items-center space-x-2">
          {getIconComponent(device.icon || '')}
          <CardTitle className="iot-card-title">{device.name}</CardTitle>
        </div>
        <Switch 
          checked={device.status} 
          onCheckedChange={handleToggle} 
          className="iot-switch"
        />
      </CardHeader>
      <CardContent className="iot-card-content">
        <div className="text-sm text-muted-foreground">
          Status: {device.status ? 'On' : 'Off'}
          
          {device.type === 'slider' && device.status && device.value !== undefined && (
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>{device.min}°</span>
                <span>{device.value}°</span>
                <span>{device.max}°</span>
              </div>
              <input
                type="range"
                min={device.min}
                max={device.max}
                value={device.value}
                onChange={(e) => onValueChange && onValueChange(device.id, parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Utility function to detect touch devices
const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Main Dashboard Component
const Dashboard: React.FC = () => {
  const [devices, setDevices] = useState<IoTDevice[]>(initialDevices);
  const [layouts, setLayouts] = useState<any>([]);
  
  // Initialize layout from devices
  useEffect(() => {
    const initialLayout = devices.map((device) => ({
      i: device.id,
      x: device.x,
      y: device.y,
      w: 1,
      h: 1,
    }));
    setLayouts(initialLayout);
  }, []);

  const handleToggleDevice = (id: string, status: boolean) => {
    const updatedDevices = devices.map(device => 
      device.id === id ? { ...device, status } : device
    );
    setDevices(updatedDevices);
    toast.success(`Device ${status ? 'activated' : 'deactivated'}`);
  };

  const handleValueChange = (id: string, value: number) => {
    const updatedDevices = devices.map(device => 
      device.id === id ? { ...device, value } : device
    );
    setDevices(updatedDevices);
  };

  const handleLayoutChange = (newLayout: any) => {
    setLayouts(newLayout);
    // Update device positions based on layout
    const updatedDevices = devices.map(device => {
      const layoutItem = newLayout.find((item: any) => item.i === device.id);
      if (layoutItem) {
        return {
          ...device,
          x: layoutItem.x,
          y: layoutItem.y,
        };
      }
      return device;
    });
    setDevices(updatedDevices);
  };

  const handleAddDevice = () => {
    // This would typically open a modal to configure a new device
    toast.info('Device addition feature will be implemented soon');
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">IoT Control Dashboard</h1>
        <Button onClick={handleAddDevice}>
          <Plus className="mr-2 h-4 w-4" />
          Add Device
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <DndProvider backend={isTouchDevice() ? TouchBackend : HTML5Backend}>
          <div className="bg-muted/30 p-4 rounded-lg min-h-[500px]">
            {layouts.length > 0 && (
              <GridLayout
                className="layout"
                layout={layouts}
                cols={2}
                rowHeight={200}
                width={window.innerWidth < 640 ? window.innerWidth - 32 : 600}
                isResizable={false}
                isDraggable={true}
                onLayoutChange={handleLayoutChange}
                margin={[16, 16]}
              >
                {devices.map(device => (
                  <div key={device.id}>
                    <DeviceCard
                      device={device}
                      onToggle={handleToggleDevice}
                      onValueChange={handleValueChange}
                    />
                  </div>
                ))}
              </GridLayout>
            )}
          </div>
        </DndProvider>
      </div>
    </div>
  );
};

export default Dashboard;
