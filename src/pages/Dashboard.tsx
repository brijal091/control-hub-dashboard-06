/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { 
  LightbulbIcon, 
  Fan, 
  Thermometer, 
  Plug, 
  Power, 
  Plus,
  X,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Timer,
  Settings,
  Gauge
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';

// Extended component types
type DeviceType = 'switch' | 'slider' | 'button' | 'input' | 'stepH' | 'stepV' | 'joystick' | 'timer';

// Interface for IoT Device
interface IoTDevice {
  id: string;
  name: string;
  type: DeviceType;
  status?: boolean;
  value?: number;
  min?: number;
  max?: number;
  x: number;
  y: number;
  w: number;
  h: number;
  icon?: string;
  organizationId: string;
  color?: string;
  timerValue?: number;
  joystickPosition?: { x: number, y: number };
}

// Mock device data updated for machinery control
const initialDevices: IoTDevice[] = [
  {
    id: '1',
    name: 'Power Switch',
    type: 'switch',
    status: false,
    x: 0,
    y: 0,
    w: 1,
    h: 1,
    icon: 'Power',
    organizationId: '1',
    color: 'hsl(var(--primary))'
  },
  {
    id: '2',
    name: 'Speed Control',
    type: 'slider',
    status: true,
    value: 30,
    min: 0,
    max: 100,
    x: 1,
    y: 0,
    w: 2,
    h: 1,
    icon: 'Gauge',
    organizationId: '1',
    color: 'hsl(var(--accent))'
  },
  {
    id: '3',
    name: 'Direction',
    type: 'stepH',
    x: 0,
    y: 1,
    w: 1,
    h: 1,
    organizationId: '1',
    color: 'hsl(var(--secondary))'
  },
  {
    id: '4',
    name: 'Emergency Stop',
    type: 'button',
    status: false,
    x: 1,
    y: 1,
    w: 1,
    h: 1,
    organizationId: '1',
    color: 'hsl(var(--destructive))'
  },
  {
    id: '5',
    name: 'Position',
    type: 'stepV',
    x: 2,
    y: 1,
    w: 1,
    h: 1,
    organizationId: '1',
    color: 'hsl(var(--secondary))'
  },
  {
    id: '6',
    name: 'Manual Control',
    type: 'joystick',
    x: 0,
    y: 2,
    w: 2,
    h: 2,
    joystickPosition: { x: 0, y: 0 },
    organizationId: '1',
    color: 'hsl(var(--primary))'
  },
  {
    id: '7',
    name: 'Process Timer',
    type: 'timer',
    timerValue: 60,
    x: 2,
    y: 2,
    w: 1,
    h: 1,
    organizationId: '1',
    color: 'hsl(var(--accent))'
  },
  {
    id: '8',
    name: 'Input Value',
    type: 'input',
    value: 100,
    x: 2,
    y: 3,
    w: 1,
    h: 1,
    organizationId: '1',
    color: 'hsl(var(--primary))'
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
    case 'Gauge':
      return <Gauge className="h-5 w-5" />;
    case 'Timer':
      return <Timer className="h-5 w-5" />;
    case 'Settings':
      return <Settings className="h-5 w-5" />;
    default:
      return <Power className="h-5 w-5" />;
  }
};

// Switch Component
const SwitchControl: React.FC<{
  device: IoTDevice;
  onToggle: (id: string, status: boolean) => void;
}> = ({ device, onToggle }) => {
  const handleToggle = () => {
    onToggle(device.id, !device.status);
  };

  return (
    <div className="flex flex-col h-full items-center justify-center p-2 bg-card rounded-lg border border-border">
      <div className="text-sm font-medium mb-2 text-foreground">{device.name}</div>
      <div 
        className="w-full h-24 flex items-center justify-center rounded-md cursor-pointer transition-all"
        style={{ 
          backgroundColor: device.status ? device.color : 'hsl(var(--muted))',
          color: device.status ? 'hsl(var(--primary-foreground))' : device.color,
          border: `1px solid ${device.color}`,
        }}
        onClick={handleToggle}
      >
        <span className="text-xl font-bold">{device.status ? 'ON' : 'OFF'}</span>
      </div>
    </div>
  );
};

// Slider Component
const SliderControl: React.FC<{
  device: IoTDevice;
  onValueChange: (id: string, value: number) => void;
}> = ({ device, onValueChange }) => {
  const handleSliderChange = (value: number[]) => {
    onValueChange(device.id, value[0]);
  };

  return (
    <div className="flex flex-col h-full p-2 bg-card rounded-lg border border-border">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm font-medium text-foreground">{device.name}</div>
        <div className="text-sm font-medium" style={{ color: device.color }}>
          {device.value}
        </div>
      </div>
      <div className="flex items-center">
        <div className="bg-muted p-2 rounded-l-md">
          <div className="flex flex-col items-center space-y-1" style={{ color: device.color }}>
            <span>|||</span>
          </div>
        </div>
        <div className="flex-1 px-2">
          <Slider
            value={[device.value || 0]}
            min={device.min || 0}
            max={device.max || 100}
            step={1}
            onValueChange={handleSliderChange}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

// Button Component
const ButtonControl: React.FC<{
  device: IoTDevice;
  onToggle: (id: string, status: boolean) => void;
}> = ({ device, onToggle }) => {
  const handleClick = () => {
    onToggle(device.id, !device.status);
    if (!device.status) {
      setTimeout(() => {
        onToggle(device.id, false);
      }, 300);
    }
  };

  return (
    <div className="flex flex-col h-full items-center justify-center p-2 bg-card rounded-lg border border-border">
      <div className="text-sm font-medium mb-2 text-foreground">{device.name}</div>
      <div 
        className="w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-all"
        style={{ 
          border: `2px solid ${device.color}`,
          color: device.color,
          backgroundColor: device.status ? device.color : 'transparent',
        }}
        onClick={handleClick}
      >
        <span className="text-md font-bold" style={{ color: device.status ? 'hsl(var(--primary-foreground))' : device.color }}>
          {device.status ? 'ON' : 'OFF'}
        </span>
      </div>
    </div>
  );
};

// Step Horizontal Component
const StepHControl: React.FC<{
  device: IoTDevice;
  onValueChange: (id: string, value: number, direction: 'left' | 'right') => void;
}> = ({ device, onValueChange }) => {
  return (
    <div className="flex flex-col h-full p-2 bg-card rounded-lg border border-border">
      <div className="text-sm font-medium mb-2 text-foreground">{device.name}</div>
      <div className="flex justify-between items-center">
        <button 
          className="p-3 rounded bg-muted hover:bg-accent transition-colors"
          style={{ border: `1px solid ${device.color}`, color: device.color }}
          onClick={() => onValueChange(device.id, -1, 'left')}
        >
          <ArrowLeft size={20} />
        </button>
        <button 
          className="p-3 rounded bg-muted hover:bg-accent transition-colors"
          style={{ border: `1px solid ${device.color}`, color: device.color }}
          onClick={() => onValueChange(device.id, 1, 'right')}
        >
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

// Step Vertical Component
const StepVControl: React.FC<{
  device: IoTDevice;
  onValueChange: (id: string, value: number, direction: 'up' | 'down') => void;
}> = ({ device, onValueChange }) => {
  return (
    <div className="flex flex-col h-full p-2 bg-card rounded-lg border border-border">
      <div className="text-sm font-medium mb-2 text-foreground">{device.name}</div>
      <div className="flex flex-col space-y-2 items-center">
        <button 
          className="p-3 rounded bg-muted hover:bg-accent transition-colors"
          style={{ border: `1px solid ${device.color}`, color: device.color }}
          onClick={() => onValueChange(device.id, 1, 'up')}
        >
          <ArrowUp size={20} />
        </button>
        <div className="text-xs text-center text-muted-foreground">0</div>
        <button 
          className="p-3 rounded bg-muted hover:bg-accent transition-colors"
          style={{ border: `1px solid ${device.color}`, color: device.color }}
          onClick={() => onValueChange(device.id, -1, 'down')}
        >
          <ArrowDown size={20} />
        </button>
      </div>
    </div>
  );
};

// Input Component
const InputControl: React.FC<{
  device: IoTDevice;
  onValueChange: (id: string, value: number) => void;
}> = ({ device, onValueChange }) => {
  const [inputValue, setInputValue] = useState(device.value?.toString() || '0');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    const numValue = Number(inputValue);
    if (!isNaN(numValue)) {
      onValueChange(device.id, numValue);
    }
  };

  return (
    <div className="flex flex-col h-full p-2 bg-card rounded-lg border border-border">
      <div className="text-sm font-medium mb-2 text-foreground">{device.name}</div>
      <div className="flex space-x-2 items-center">
        <Input
          type="number"
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full"
          style={{ color: device.color, borderColor: device.color }}
        />
      </div>
    </div>
  );
};

// Joystick Component
const JoystickControl: React.FC<{
  device: IoTDevice;
  onJoystickMove: (id: string, x: number, y: number) => void;
}> = ({ device, onJoystickMove }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(device.joystickPosition || { x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updatePosition(e.clientX, e.clientY);
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    updatePosition(e.touches[0].clientX, e.touches[0].clientY);
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      updatePosition(e.clientX, e.clientY);
    }
  };
  
  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging && e.touches[0]) {
      updatePosition(e.touches[0].clientX, e.touches[0].clientY);
    }
  };
  
  const handleEnd = () => {
    setIsDragging(false);
    setPosition({ x: 0, y: 0 });
    onJoystickMove(device.id, 0, 0);
  };

  const updatePosition = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    let x = (clientX - centerX) / (rect.width / 2);
    let y = (clientY - centerY) / (rect.height / 2);
    
    const distance = Math.sqrt(x * x + y * y);
    if (distance > 1) {
      x = x / distance;
      y = y / distance;
    }
    
    setPosition({ x, y });
    onJoystickMove(device.id, parseFloat(x.toFixed(3)), parseFloat(y.toFixed(3)));
  };
  
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleEnd);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  return (
    <div className="flex flex-col h-full p-2 bg-card rounded-lg border border-border">
      <div className="text-sm font-medium mb-2 text-foreground">{device.name}</div>
      <div className="flex items-center justify-center flex-grow">
        <div
          ref={containerRef}
          className="relative w-24 h-24 rounded-full bg-muted"
          style={{ border: `2px solid ${device.color}` }}
        >
          <div 
            className="absolute"
            style={{
              left: `calc(50% + ${position.x * 30}px)`,
              top: `calc(50% + ${position.y * 30}px)`,
              transform: 'translate(-50%, -50%)',
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: device.color,
              cursor: 'grab',
              touchAction: 'none',
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          />
          <div className="absolute text-xs" style={{ 
            top: '5px', 
            left: '50%', 
            transform: 'translateX(-50%)',
            color: device.color 
          }}>
            {position.y.toFixed(2)}
          </div>
          <div className="absolute text-xs" style={{ 
            bottom: '5px', 
            left: '50%', 
            transform: 'translateX(-50%)',
            color: device.color 
          }}>
            {(-position.y).toFixed(2)}
          </div>
          <div className="absolute text-xs" style={{ 
            left: '5px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: device.color 
          }}>
            {(-position.x).toFixed(2)}
          </div>
          <div className="absolute text-xs" style={{ 
            right: '5px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: device.color 
          }}>
            {position.x.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

// Timer Component
const TimerControl: React.FC<{
  device: IoTDevice;
  onValueChange: (id: string, value: number) => void;
}> = ({ device, onValueChange }) => {
  const [time, setTime] = useState(device.timerValue || 0);
  const [isRunning, setIsRunning] = useState(false);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleStart = () => {
    setIsRunning(true);
  };
  
  const handleStop = () => {
    setIsRunning(false);
  };
  
  const handleReset = () => {
    setIsRunning(false);
    setTime(device.timerValue || 0);
    onValueChange(device.id, device.timerValue || 0);
  };
  
  const handleAdjust = (amount: number) => {
    const newTime = Math.max(0, time + amount);
    setTime(newTime);
    onValueChange(device.id, newTime);
  };
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            setIsRunning(false);
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, time]);

  return (
    <div className="flex flex-col h-full p-2 bg-card rounded-lg border border-border">
      <div className="text-sm font-medium mb-2 text-foreground">{device.name}</div>
      <div className="flex flex-col items-center space-y-2">
        <div 
          className="text-xl font-mono w-full text-center py-1 rounded text-primary"
          style={{ borderBottom: `1px dashed ${device.color}` }}
        >
          {formatTime(time)}
        </div>
        <div className="flex space-x-2">
          <button
            className="px-2 py-1 rounded text-xs bg-muted hover:bg-accent transition-colors"
            style={{ border: `1px solid ${device.color}`, color: device.color }}
            onClick={() => handleAdjust(-10)}
          >
            -10s
          </button>
          <button
            className="px-2 py-1 rounded text-xs bg-muted hover:bg-accent transition-colors"
            style={{ border: `1px solid ${device.color}`, color: device.color }}
            onClick={() => handleAdjust(10)}
          >
            +10s
          </button>
        </div>
        <div className="flex space-x-2">
          {!isRunning ? (
            <button
              className="px-3 py-1 rounded text-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              onClick={handleStart}
            >
              Start
            </button>
          ) : (
            <button
              className="px-3 py-1 rounded text-xs bg-muted hover:bg-accent transition-colors"
              style={{ border: `1px solid ${device.color}`, color: device.color }}
              onClick={handleStop}
            >
              Pause
            </button>
          )}
          <button
            className="px-3 py-1 rounded text-xs bg-muted hover:bg-accent transition-colors"
            style={{ border: `1px solid ${device.color}`, color: device.color }}
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

// Device form interface
interface DeviceFormData {
  name: string;
  type: DeviceType;
  icon?: string;
  min?: number;
  max?: number;
  value?: number;
  color?: string;
}

// Component to render the appropriate control based on device type
const DeviceControl: React.FC<{
  device: IoTDevice;
  onToggle: (id: string, status: boolean) => void;
  onValueChange: (id: string, value: number, direction?: string) => void;
  onJoystickMove: (id: string, x: number, y: number) => void;
}> = ({ device, onToggle, onValueChange, onJoystickMove }) => {
  switch (device.type) {
    case 'switch':
      return <SwitchControl device={device} onToggle={onToggle} />;
    case 'slider':
      return <SliderControl device={device} onValueChange={onValueChange} />;
    case 'button':
      return <ButtonControl device={device} onToggle={onToggle} />;
    case 'input':
      return <InputControl device={device} onValueChange={onValueChange} />;
    case 'stepH':
      return <StepHControl device={device} onValueChange={(id, value, direction) => onValueChange(id, value, direction)} />;
    case 'stepV':
      return <StepVControl device={device} onValueChange={(id, value, direction) => onValueChange(id, value, direction)} />;
    case 'joystick':
      return <JoystickControl device={device} onJoystickMove={onJoystickMove} />;
    case 'timer':
      return <TimerControl device={device} onValueChange={onValueChange} />;
    default:
      return <div>Unknown device type</div>;
  }
};

// Main Dashboard Component
const MachineryDashboard: React.FC = () => {
  const [devices, setDevices] = useState<IoTDevice[]>(initialDevices);
  const [layouts, setLayouts] = useState<any>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newDevice, setNewDevice] = useState<DeviceFormData>({
    name: '',
    type: 'switch',
    icon: 'Power',
    color: 'hsl(var(--primary))'
  });
  const [activeArea, setActiveArea] = useState('main');
  const isMobile = useIsMobile();

  // Initialize layout from devices
  useEffect(() => {
    const initialLayout = devices.map((device) => ({
      i: device.id,
      x: device.x,
      y: device.y,
      w: device.w || 1,
      h: device.h || 1,
      minW: 1,
      minH: 1,
    }));
    setLayouts(initialLayout);
  }, []);

  const handleToggleDevice = (id: string, status: boolean) => {
    try {
      const updatedDevices = devices.map(device => 
        device.id === id ? { ...device, status } : device
      );
      setDevices(updatedDevices);
      toast.success(`Device ${status ? 'turned on' : 'turned off'}`);
    } catch (error) {
      toast.error('Failed to toggle device');
      console.error('Toggle error:', error);
    }
  };

  const handleValueChange = (id: string, value: number, direction?: string) => {
    const updatedDevices = devices.map(device => {
      if (device.id === id) {
        return { ...device, value };
      }
      return device;
    });
    setDevices(updatedDevices);
    
    if (direction) {
      toast.success(`${direction.charAt(0).toUpperCase() + direction.slice(1)} direction applied`);
    }
  };

  const handleJoystickMove = (id: string, x: number, y: number) => {
    const updatedDevices = devices.map(device => {
      if (device.id === id) {
        return { ...device, joystickPosition: { x, y } };
      }
      return device;
    });
    setDevices(updatedDevices);
  };

  const handleLayoutChange = (newLayout: any) => {
    setLayouts(newLayout);
    
    const updatedDevices = devices.map(device => {
      const layoutItem = newLayout.find((item: any) => item.i === device.id);
      if (layoutItem) {
        return {
          ...device,
          x: layoutItem.x,
          y: layoutItem.y,
          w: layoutItem.w,
          h: layoutItem.h,
        };
      }
      return device;
    });
    setDevices(updatedDevices);
  };

  const handleAddDevice = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setNewDevice({
      name: '',
      type: 'switch',
      icon: 'Power',
      color: 'hsl(var(--primary))'
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDevice({
      ...newDevice,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewDevice({
      ...newDevice,
      [name]: value,
    });
  };

  const handleSaveDevice = () => {
    try {
      if (!newDevice.name) {
        toast.error('Please enter a device name');
        return;
      }

      let width = 1;
      let height = 1;
      
      if (newDevice.type === 'joystick') {
        width = 2;
        height = 2;
      } else if (newDevice.type === 'slider') {
        width = 2;
        height = 1;
      }

      const newId = `device-${Date.now()}`;
      const createdDevice: IoTDevice = {
        id: newId,
        name: newDevice.name,
        type: newDevice.type,
        icon: newDevice.icon,
        color: newDevice.color,
        organizationId: '1',
        x: 0,
        y: devices.length > 0 ? Math.max(...devices.map(d => d.y)) + 1 : 0,
        w: width,
        h: height,
      };

      switch (newDevice.type) {
        case 'switch':
        case 'button':
          createdDevice.status = false;
          break;
        case 'slider':
          createdDevice.status = true;
          createdDevice.value = newDevice.value || 0;
          createdDevice.min = newDevice.min || 0;
          createdDevice.max = newDevice.max || 100;
          break;
        case 'input':
          createdDevice.value = newDevice.value || 0;
          break;
        case 'timer':
          createdDevice.timerValue = 60;
          break;
        case 'joystick':
          createdDevice.joystickPosition = { x: 0, y: 0 };
          break;
      }

      const newLayoutItem = {
        i: newId,
        x: createdDevice.x,
        y: createdDevice.y,
        w: width,
        h: height,
        minW: 1,
        minH: 1
      };

      setDevices([...devices, createdDevice]);
      setLayouts([...layouts, newLayoutItem]);
      
      toast.success('Device added successfully');
      closeDialog();
      
    } catch (error) {
      toast.error('Failed to add device');
      console.error('Error adding device:', error);
    }
  };

  const getColumnCount = () => {
    if (isMobile) return 3;
    return 6;
  };

  const getGridWidth = () => {
    if (typeof window === 'undefined') return 1200;
    return window.innerWidth - 32;
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <h1 className="text-xl font-bold text-primary">Machinery Control</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select 
            value={activeArea} 
            onValueChange={setActiveArea}
          >
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Select area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="main">Main Control</SelectItem>
              <SelectItem value="production">Production Line</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={handleAddDevice}
            className="w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Control
          </Button>
        </div>
      </div>

      <div className="bg-muted/50 p-2 rounded-lg min-h-[500px]">
        {layouts.length > 0 && (
          <GridLayout
            className="layout"
            layout={layouts}
            cols={getColumnCount()}
            rowHeight={isMobile ? 80 : 100}
            width={getGridWidth()}
            isResizable={!isMobile}
            isDraggable={true}
            onLayoutChange={handleLayoutChange}
            margin={[8, 8]}
            compactType="vertical"
            resizeHandles={['se']}
            draggableHandle=".device-header"
          >
            {devices.map(device => (
              <div key={device.id} style={{ overflow: 'hidden' }}>
                <div className="device-header cursor-move h-6 flex items-center justify-between px-2 mb-1 rounded bg-muted">
                  <span className="text-xs truncate" style={{ color: device.color }}>{device.name}</span>
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => {
                      setDevices(devices.filter(d => d.id !== device.id));
                      setLayouts(layouts.filter((l: any) => l.i !== device.id));
                    }} 
                  />
                </div>
                <DeviceControl 
                  device={device} 
                  onToggle={handleToggleDevice} 
                  onValueChange={handleValueChange}
                  onJoystickMove={handleJoystickMove}
                />
              </div>
            ))}
          </GridLayout>
        )}
      </div>

      {/* Add Device Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Control</DialogTitle>
            <DialogDescription>
              Add a new control element to your machinery dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Speed Control"
                className="col-span-3"
                value={newDevice.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select 
                value={newDevice.type} 
                onValueChange={(value) => handleSelectChange('type', value as DeviceType)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select control type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="switch">Switch (On/Off)</SelectItem>
                  <SelectItem value="slider">Slider (Range)</SelectItem>
                  <SelectItem value="button">Button</SelectItem>
                  <SelectItem value="input">Input Field</SelectItem>
                  <SelectItem value="stepH">Step Horizontal</SelectItem>
                  <SelectItem value="stepV">Step Vertical</SelectItem>
                  <SelectItem value="joystick">Joystick</SelectItem>
                  <SelectItem value="timer">Timer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {(newDevice.type === 'switch' || newDevice.type === 'slider' || newDevice.type === 'button') && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="icon" className="text-right">
                  Icon
                </Label>
                <Select 
                  value={newDevice.icon} 
                  onValueChange={(value) => handleSelectChange('icon', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select icon" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Power">Power</SelectItem>
                    <SelectItem value="Gauge">Gauge</SelectItem>
                    <SelectItem value="Settings">Settings</SelectItem>
                    <SelectItem value="Fan">Fan</SelectItem>
                    <SelectItem value="Thermometer">Thermometer</SelectItem>
                    <SelectItem value="Timer">Timer</SelectItem>
                    <SelectItem value="Plug">Socket</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="color" className="text-right">
                Color
              </Label>
              <div className="col-span-3 flex gap-2">
                <Input
                  id="color"
                  name="color"
                  type="color"
                  className="w-12 h-10 p-1"
                  value={newDevice.color}
                  onChange={handleInputChange}
                />
                <Input
                  name="color"
                  className="flex-1"
                  value={newDevice.color}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            {newDevice.type === 'slider' && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="min" className="text-right">
                    Min Value
                  </Label>
                  <Input
                    id="min"
                    name="min"
                    type="number"
                    placeholder="0"
                    className="col-span-3"
                    value={newDevice.min || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="max" className="text-right">
                    Max Value
                  </Label>
                  <Input
                    id="max"
                    name="max"
                    type="number"
                    placeholder="100"
                    className="col-span-3"
                    value={newDevice.max || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="value" className="text-right">
                    Default Value
                  </Label>
                  <Input
                    id="value"
                    name="value"
                    type="number"
                    placeholder="50"
                    className="col-span-3"
                    value={newDevice.value || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={closeDialog}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveDevice}
            >
              Add Control
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MachineryDashboard;