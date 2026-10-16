export interface Notice {
  id?: string;
  title: string;
  category: 'Admissions' | 'Academics' | 'Sports' | 'Circular' | 'Events';
  date: string;
  isNew: boolean;
  details: string;
  downloadable: boolean;
  createdAt: string;
}

export interface Admission {
  id?: string;
  studentName: string;
  parentName: string;
  phone: string;
  classGrade: string;
  stream: string;
  village: string;
  needBus: boolean;
  status: 'New' | 'Contacted' | 'Admitted';
  createdAt: string;
}

export interface Achiever {
  id?: string;
  name: string;
  title: string;
  scoreOrAward: string;
  category: 'Board Topper' | 'Sports' | 'Merit';
  year: string;
  imageUrl: string;
  createdAt: string;
}

export interface MediaItem {
  id?: string;
  title: string;
  type: 'photo' | 'video';
  mediaUrl: string;
  category: 'Campus' | 'Sports' | 'Toppers' | 'Celebrations' | 'AnnualDay';
  createdAt: string;
}

export interface SchoolEvent {
  id?: string;
  title: string;
  date: string;
  venue: string;
  description: string;
  category: 'Academic' | 'Sports' | 'Cultural' | 'Celebration';
  status: 'Upcoming' | 'Completed';
  bannerUrl: string;
  createdAt: string;
}

export interface AdminUser {
  id?: string;
  username: string;
  fullName: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
}

export type Page = 'home' | 'notices' | 'admission' | 'achievers' | 'gallery' | 'events' | 'about' | 'contact' | 'admin';
