import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';

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
  content: Record<string, Record<string, ContentItem>>; // locale -> id -> content
  sections: Record<string, SectionData>;
  globalSettings: GlobalSettings;
  isLoading: boolean;
  
  // Content methods
  updateContent: (id: string, data: Partial<ContentItem>, locale?: string) => Promise<void>;
  getContent: (id: string, locale?: string) => ContentItem | undefined;
  
  // Section methods
  updateSection: (id: string, data: Partial<SectionData>) => Promise<void>;
  getSection: (id: string) => SectionData | undefined;
  
  // Global settings methods
  updateGlobalSettings: (data: Partial<GlobalSettings>) => Promise<void>;
  
  // Database sync methods
  loadContent: () => Promise<void>;
  saveContentToDatabase: (id: string, data: ContentItem, locale: string) => Promise<void>;
  
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
      content: { sv: {}, en: {} },
      sections: {},
      globalSettings: initialGlobalSettings,
      isLoading: false,
      
      updateContent: async (id: string, data: Partial<ContentItem>, locale: string = 'sv') => {
        const currentLocaleContent = get().content[locale] || {};
        const contentItem: ContentItem = {
          ...currentLocaleContent[id],
          ...data,
          id
        };

        // Update local state immediately for responsive UI
        set((state) => ({
          content: {
            ...state.content,
            [locale]: {
              ...(state.content[locale] || {}),
              [id]: contentItem
            }
          }
        }));

        // Save to database
        await get().saveContentToDatabase(id, contentItem, locale);

        // If saving Swedish content, trigger automatic translation
        if (locale === 'sv' && typeof contentItem.value === 'string') {
          console.log('Triggering automatic translation for:', id);
          try {
            const { data: translationData, error } = await supabase.functions.invoke('translate-site-content', {
              body: {
                content_id: id,
                sv_text: contentItem.value,
                content_type: contentItem.type,
                styles: contentItem.styles
              }
            });

            if (error) {
              console.error('Translation error:', error);
            } else {
              console.log('Automatic translation completed:', translationData);
              
              // Update English content in store
              if (translationData?.en_text) {
                set((state) => ({
                  content: {
                    ...state.content,
                    en: {
                      ...(state.content.en || {}),
                      [id]: {
                        id,
                        type: contentItem.type,
                        value: translationData.en_text,
                        styles: contentItem.styles
                      }
                    }
                  }
                }));
              }
            }
          } catch (error) {
            console.error('Failed to trigger automatic translation:', error);
          }
        }
      },
      
      getContent: (id: string, locale: string = 'sv') => {
        const localeContent = get().content[locale] || {};
        return localeContent[id];
      },
      
      updateSection: async (id: string, data: Partial<SectionData>) => {
        const sectionData: SectionData = {
          ...get().sections[id],
          ...data,
          id
        };

        // Update local state immediately
        set((state) => ({
          sections: {
            ...state.sections,
            [id]: sectionData
          }
        }));

        // Save section as content to database
        await get().saveContentToDatabase(`section_${id}`, {
          id: `section_${id}`,
          type: 'section' as any,
          value: JSON.stringify(sectionData),
          styles: {}
        }, 'sv');
      },
      
      getSection: (id: string) => {
        return get().sections[id];
      },
      
      updateGlobalSettings: async (data: Partial<GlobalSettings>) => {
        const newSettings = {
          ...get().globalSettings,
          ...data
        };

        // Update local state immediately
        set((state) => ({
          globalSettings: newSettings
        }));

        // Save global settings to database
        await get().saveContentToDatabase('global_settings', {
          id: 'global_settings',
          type: 'settings' as any,
          value: JSON.stringify(newSettings),
          styles: {}
        }, 'sv');
      },

      loadContent: async () => {
        try {
          set({ isLoading: true });
          
          const { data: contentData, error } = await supabase
            .from('site_content')
            .select('*');

          if (error) {
            console.error('Error loading content:', error);
            return;
          }

          const content: Record<string, Record<string, ContentItem>> = { sv: {}, en: {} };
          const sections: Record<string, SectionData> = {};
          let globalSettings = initialGlobalSettings;

          contentData?.forEach((item) => {
            const locale = item.locale || 'sv';
            
            if (item.content_id === 'global_settings') {
              try {
                globalSettings = JSON.parse(item.value as string);
              } catch (error) {
                console.error('Error parsing global settings:', error);
              }
            } else if (item.content_id.startsWith('section_')) {
              const sectionId = item.content_id.replace('section_', '');
              try {
                sections[sectionId] = JSON.parse(item.value as string);
              } catch (error) {
                console.error('Error parsing section data:', error);
              }
            } else {
              if (!content[locale]) {
                content[locale] = {};
              }
              content[locale][item.content_id] = {
                id: item.content_id,
                type: item.content_type as any,
                value: typeof item.value === 'string' ? item.value : JSON.stringify(item.value),
                styles: (item.styles as any) || {}
              };
            }
          });

          set({
            content,
            sections,
            globalSettings,
            isLoading: false
          });
        } catch (error) {
          console.error('Failed to load content from database:', error);
          set({ isLoading: false });
        }
      },

      saveContentToDatabase: async (id: string, data: ContentItem, locale: string) => {
        try {
          const { error } = await supabase
            .from('site_content')
            .upsert({
              content_id: id,
              content_type: data.type,
              value: data.value,
              styles: data.styles,
              locale: locale
            }, {
              onConflict: 'content_id,locale'
            });

          if (error) {
            console.error('Error saving content to database:', error);
            throw error;
          }

          console.log('Content saved successfully:', id, 'locale:', locale);
        } catch (error) {
          console.error('Failed to save content to database:', error);
          throw error;
        }
      },
      
      reset: () => {
        set({
          content: { sv: {}, en: {} },
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