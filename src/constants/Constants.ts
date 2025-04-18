import { IoTDevice } from "@/types";

// Mock device data updated for machinery control
export const initialDevices: IoTDevice[] = [
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
  