import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ContentItem {
  id: string;
  type: 'text' | 'heading' | 'image' | 'list' | 'button';
  value: string | string[];
  styles?: {
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    fontFamily?: string;
    textAlign?: string;
    lineHeight?: string;
    letterSpacing?: string;
    textDecoration?: string;
    textTransform?: string;
    fontStyle?: string;
  };
  className?: string;
}

interface SectionData {
  id: string;
  title?: string;
  backgroundColor?: string;
  textColor?: string;
  padding?: string;
  margin?: string;
  visibility?: boolean;
  customCss?: string;
  styles?: Record<string, any>;
}

interface GlobalSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  faviconUrl: string;
  maintenanceMode: boolean;
  analyticsEnabled: boolean;
  chatEnabled: boolean;
  customFonts: Array<{
    name: string;
    url: string;
    family: string;
  }>;
}

interface ContentStore {
  content: Record<string, ContentItem>;
  sections: Record<string, SectionData>;
  globalSettings: GlobalSettings;
  
  // Content methods
  updateContent: (id: string, data: Partial<ContentItem>) => void;
  getContent: (id: string) => ContentItem | undefined;
  
  // Section methods
  updateSection: (id: string, data: Partial<SectionData>) => void;
  getSection: (id: string) => SectionData | undefined;
  
  // Global settings methods
  updateGlobalSettings: (data: Partial<GlobalSettings>) => void;
  
  // Utility methods
  reset: () => void;
  exportData: () => string;
  importData: (data: string) => void;
}

const initialGlobalSettings: GlobalSettings = {
  siteName: 'Fixco',
  siteDescription: 'Professionella hemtjänster för ditt hem',
  contactEmail: 'info@fixco.se',
  contactPhone: '08-123 456 78',
  primaryColor: '#3b82f6',
  secondaryColor: '#64748b',
  logoUrl: '/assets/fixco-logo-black.png',
  faviconUrl: '/favicon.ico',
  maintenanceMode: false,
  analyticsEnabled: true,
  chatEnabled: true,
  customFonts: []
};

export const useContentStore = create<ContentStore>()(
  persist(
    (set, get) => ({
      content: {},
      sections: {},
      globalSettings: initialGlobalSettings,
      
      updateContent: (id: string, data: Partial<ContentItem>) => {
        set((state) => ({
          content: {
            ...state.content,
            [id]: {
              ...state.content[id],
              ...data,
              id
            }
          }
        }));
      },
      
      getContent: (id: string) => {
        return get().content[id];
      },
      
      updateSection: (id: string, data: Partial<SectionData>) => {
        set((state) => ({
          sections: {
            ...state.sections,
            [id]: {
              ...state.sections[id],
              ...data,
              id
            }
          }
        }));
      },
      
      getSection: (id: string) => {
        return get().sections[id];
      },
      
      updateGlobalSettings: (data: Partial<GlobalSettings>) => {
        set((state) => ({
          globalSettings: {
            ...state.globalSettings,
            ...data
          }
        }));
      },
      
      reset: () => {
        set({
          content: {},
          sections: {},
          globalSettings: initialGlobalSettings
        });
      },
      
      exportData: () => {
        return JSON.stringify(get(), null, 2);
      },
      
      importData: (data: string) => {
        try {
          const parsed = JSON.parse(data);
          set(parsed);
        } catch (error) {
          console.error('Failed to import data:', error);
        }
      }
    }),
    {
      name: 'fixco-content-store',
      version: 1
    }
  )
);