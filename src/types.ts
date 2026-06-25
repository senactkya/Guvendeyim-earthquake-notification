export interface Contact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

export interface Earthquake {
  title: string;
  date: string;
  time: string;
  depth: number;
  magnitude: number;
  location: string;
  latitude: number;
  longitude: number;
}

export interface BagItem {
  id: string;
  name: string;
  category: 'vital' | 'medical' | 'tactical' | 'sanitary';
  iconName: string;
  checked: boolean;
  turkishLabel: string;
  description: string;
}

export interface SafeMeetingPoint {
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  image: string;
}

export interface SafetyScenario {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tips: string[];
}
