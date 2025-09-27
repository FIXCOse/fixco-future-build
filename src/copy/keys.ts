export type CopyKey =
  // Navigation
  | 'nav.home' | 'nav.services' | 'nav.smartHome' | 'nav.references' 
  | 'nav.about' | 'nav.contact' | 'nav.myFixco' | 'nav.adminPanel'
  
  // Trust chips
  | 'chips.f_skatt' | 'chips.insured' | 'chips.start_lt_5' | 'chips.fixed_price'
  | 'chips.rot_50' | 'chips.rut_50' | 'chips.transparent' | 'chips.free_quote'
  | 'chips.we_handle_rot' | 'chips.happy_customers' | 'chips.fast_support'
  | 'chips.certified' | 'chips.warranty' | 'chips.eco_friendly' 
  | 'chips.quick_response' | 'chips.quality_work' | 'chips.more'
  
  // Buttons & CTAs  
  | 'cta.book_now' | 'cta.request_quote' | 'cta.call_us' | 'cta.login' | 'cta.get_quote'
  | 'cta.see_all' | 'cta.book_direct' | 'cta.book_installation' | 'cta.free_consultation'
  
  // Services
  | 'services.title' | 'services.subtitle' | 'services.rot_benefit'
  | 'services.choose_category' | 'services.category_description'
  | 'services.all_services' | 'services.all_services_description'
  | 'services.visualize_project' | 'services.visualize_description'
  | 'services.ai_assistant' | 'services.ai_description'
  | 'services.rot_section_title' | 'services.rot_what_title' | 'services.rot_what_description'
  | 'services.rot_we_handle_title' | 'services.rot_we_handle_description'
  | 'services.request_quote_rot' | 'services.count' | 'services.ordinary_price'
  | 'services.with_rot' | 'services.savings' | 'services.energy_efficient'
  | 'services.eco_materials' | 'services.ai_optimized' | 'services.rot_eligible'
  | 'services.eco_score' | 'services.preview' | 'services.show_3d' | 'services.incl_install'
  | 'services.quote_after_inspection'
  
  // Smart Home
  | 'smartHome.title' | 'smartHome.subtitle' | 'smartHome.energy_reduction'
  | 'smartHome.connected_devices' | 'smartHome.automation' | 'smartHome.savings'
  | 'smartHome.products_title' | 'smartHome.products_subtitle' | 'smartHome.all_products'
  | 'smartHome.loading' | 'smartHome.no_products' | 'smartHome.market_leaders'
  | 'smartHome.full_warranty' | 'smartHome.professional_install' | 'smartHome.ai_optimized'
  | 'smartHome.choose_category' | 'smartHome.main_features' | 'smartHome.smart_features'
  | 'smartHome.installation_setup' | 'smartHome.years_warranty' | 'smartHome.contact_for_info'
  
  // Categories
  | 'categories.all' | 'categories.security' | 'categories.lighting' | 'categories.climate'
  | 'categories.cleaning' | 'categories.garden' | 'categories.entertainment'
  | 'categories.all_desc' | 'categories.security_desc' | 'categories.lighting_desc'
  | 'categories.climate_desc' | 'categories.cleaning_desc' | 'categories.garden_desc'
  | 'categories.entertainment_desc'
  
  // Service Categories  
  | 'serviceCategories.el' | 'serviceCategories.vvs' | 'serviceCategories.snickeri'
  | 'serviceCategories.montering' | 'serviceCategories.tradgard' | 'serviceCategories.stadning'
  | 'serviceCategories.markarbeten' | 'serviceCategories.tekniska-installationer' | 'serviceCategories.flytt'
  
  // Filter UI  
  | 'filter.search_placeholder' | 'filter.all_services' | 'filter.all_prices'
  | 'filter.hourly_rate' | 'filter.fixed_price' | 'filter.request_quote'
  | 'filter.all_locations' | 'filter.indoor' | 'filter.outdoor' | 'filter.clear'
  | 'filter.specialty_areas' | 'filter.searching' | 'filter.services_found'
  | 'filter.no_services_rot_rut' | 'filter.with_current_filters' | 'filter.show_all_services' | 'filter.clear_other_filters'
  | 'filter.no_services_general' | 'filter.clear_filters_try_again'
  
  // Service texts that need translation
  | 'service_text.quote_for' | 'service_text.booking_for' | 'service_text.started'
  | 'service_text.sent'
  
  // Individual service translations - EL
  | 'service.el-1.title' | 'service.el-1.description'
  | 'service.el-2.title' | 'service.el-2.description'
  | 'service.el-3.title' | 'service.el-3.description'
  | 'service.el-4.title' | 'service.el-4.description'
  | 'service.el-5.title' | 'service.el-5.description'
  | 'service.el-6.title' | 'service.el-6.description'
  | 'service.el-7.title' | 'service.el-7.description'
  | 'service.el-8.title' | 'service.el-8.description'
  | 'service.el-9.title' | 'service.el-9.description'
  | 'service.el-10.title' | 'service.el-10.description'
  | 'service.el-11.title' | 'service.el-11.description'
  
  // Individual service translations - VVS
  | 'service.vvs-1.title' | 'service.vvs-1.description'
  | 'service.vvs-2.title' | 'service.vvs-2.description'
  | 'service.vvs-3.title' | 'service.vvs-3.description'
  | 'service.vvs-4.title' | 'service.vvs-4.description'
  | 'service.vvs-5.title' | 'service.vvs-5.description'
  | 'service.vvs-6.title' | 'service.vvs-6.description'
  | 'service.vvs-7.title' | 'service.vvs-7.description'
  | 'service.vvs-8.title' | 'service.vvs-8.description'
  | 'service.vvs-9.title' | 'service.vvs-9.description'
  | 'service.vvs-10.title' | 'service.vvs-10.description'
  | 'service.vvs-11.title' | 'service.vvs-11.description'
  | 'service.vvs-12.title' | 'service.vvs-12.description'
  | 'service.vvs-13.title' | 'service.vvs-13.description'
  
  // Individual service translations - SNICKERI
  | 'service.snickeri-1.title' | 'service.snickeri-1.description'
  | 'service.snickeri-2.title' | 'service.snickeri-2.description'
  | 'service.snickeri-3.title' | 'service.snickeri-3.description'
  | 'service.snickeri-4.title' | 'service.snickeri-4.description'
  | 'service.snickeri-5.title' | 'service.snickeri-5.description'
  
  // Individual service translations - MONTERING
  | 'service.montering-1.title' | 'service.montering-1.description'
  | 'service.montering-2.title' | 'service.montering-2.description'
  | 'service.montering-3.title' | 'service.montering-3.description'
  | 'service.montering-4.title' | 'service.montering-4.description'
  
  // Individual service translations - TRADGARD
  | 'service.tradgard-1.title' | 'service.tradgard-1.description'
  | 'service.tradgard-2.title' | 'service.tradgard-2.description'
  | 'service.tradgard-3.title' | 'service.tradgard-3.description'
  | 'service.tradgard-4.title' | 'service.tradgard-4.description'
  | 'service.tradgard-5.title' | 'service.tradgard-5.description'
  | 'service.tradgard-6.title' | 'service.tradgard-6.description'
  
  // Individual service translations - STADNING
  | 'service.stadning-1.title' | 'service.stadning-1.description'
  | 'service.stadning-2.title' | 'service.stadning-2.description'
  | 'service.stadning-3.title' | 'service.stadning-3.description'
  | 'service.stadning-4.title' | 'service.stadning-4.description'
  
  // Individual service translations - MARKARBETEN
  | 'service.markarbeten-1.title' | 'service.markarbeten-1.description'
  | 'service.markarbeten-2.title' | 'service.markarbeten-2.description'
  | 'service.markarbeten-3.title' | 'service.markarbeten-3.description'
  | 'service.markarbeten-4.title' | 'service.markarbeten-4.description'
  
  // Individual service translations - TEKNISKA INSTALLATIONER
  | 'service.tekniska-1.title' | 'service.tekniska-1.description'
  | 'service.tekniska-2.title' | 'service.tekniska-2.description'
  | 'service.tekniska-3.title' | 'service.tekniska-3.description'
  
  // Individual service translations - FLYTT
  | 'service.flytt-1.title' | 'service.flytt-1.description'
  | 'service.flytt-2.title' | 'service.flytt-2.description'
  | 'service.flytt-3.title' | 'service.flytt-3.description'
  
  // Project visualization texts
  | 'project.eco_performance' | 'project.ai_results' | 'project.environmental_impact'
  | 'project.rot_rut_optimization'
  
  // Pages
  | 'pages.about.title' | 'pages.about.subtitle' | 'pages.about.history_title'
  | 'pages.about.history_text' | 'pages.about.customers' | 'pages.about.days_start'
  | 'pages.about.years_exp' | 'pages.contact.title' | 'pages.references.title'
  
  // Breadcrumbs
  | 'breadcrumbs.home' | 'breadcrumbs.services';