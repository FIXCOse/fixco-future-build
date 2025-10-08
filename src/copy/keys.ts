export type CopyKey =
  // Navigation
  | 'nav.home' | 'nav.services' | 'nav.smartHome' | 'nav.references' 
  | 'nav.about' | 'nav.contact' | 'nav.myFixco' | 'nav.adminPanel'
  
  // Common
  | 'common.phone' | 'common.services'
  
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
  | 'smartHome.market_leaders_desc' | 'smartHome.professional_desc' | 'smartHome.ai_desc'
  | 'smartHome.compatibility_title' | 'smartHome.compatibility_desc'
  | 'smartHome.easy_support_title' | 'smartHome.easy_support_desc'
  | 'smartHome.future_proof_title' | 'smartHome.future_proof_desc'
  | 'smartHome.ready_for_install_title' | 'smartHome.ready_for_install_desc'
  | 'smartHome.book_installation' | 'smartHome.why_these_brands'
  | 'smartHome.market_leaders_title' | 'smartHome.market_leaders_long_desc'
  
  // Projects / References
  | 'projects.latest_title' | 'projects.latest_subtitle' | 'projects.satisfied_customers'
  | 'projects.on_time_budget' | 'projects.all_stockholm' | 'projects.completed'
  | 'projects.cta_title' | 'projects.cta_subtitle' | 'projects.request_quote'
  | 'projects.see_more' | 'projects.new_project'
  
  // FAQ Teaser
  | 'faq.no_answer_title' | 'faq.contact_response' | 'faq.call_us_with_phone' | 'faq.tell_project'
  
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
   
   // Service Categories Extended  
   | 'serviceCategories.el.title' | 'serviceCategories.el.description'
   | 'serviceCategories.vvs.title' | 'serviceCategories.vvs.description'  
   | 'serviceCategories.snickeri.title' | 'serviceCategories.snickeri.description'
   | 'serviceCategories.montering.title' | 'serviceCategories.montering.description'
   | 'serviceCategories.tradgard.title' | 'serviceCategories.tradgard.description'
   | 'serviceCategories.stadning.title' | 'serviceCategories.stadning.description'
   | 'serviceCategories.markarbeten.title' | 'serviceCategories.markarbeten.description'
   | 'serviceCategories.tekniska-installationer.title' | 'serviceCategories.tekniska-installationer.description'
   | 'serviceCategories.flytt.title' | 'serviceCategories.flytt.description'
  
  // Filter UI  
  | 'filter.search_placeholder' | 'filter.all_services' | 'filter.all_prices'
  | 'filter.hourly_rate' | 'filter.fixed_price' | 'filter.request_quote'
  | 'filter.all_locations' | 'filter.indoor' | 'filter.outdoor' | 'filter.clear'
  | 'filter.specialty_areas' | 'filter.searching' | 'filter.services_found'
  | 'filter.no_services_rot_rut' | 'filter.with_current_filters' | 'filter.show_all_services' | 'filter.clear_other_filters'
  | 'filter.no_services_general' | 'filter.clear_filters_try_again'
  
  // Price display
  | 'price.saves_with_rot' | 'price.saves_with_rut' | 'price.with_rot_discount' | 'price.with_rut_discount' | 'price.show_rot_prices'
  
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
  | 'service.stadning-5.title' | 'service.stadning-5.description'
  | 'service.stadning-6.title' | 'service.stadning-6.description'
  
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
  | 'service.flytt-4.title' | 'service.flytt-4.description'
  | 'service.flytt-5.title' | 'service.flytt-5.description'
  
  // Service Detail Page
  | 'serviceDetail.notFound' | 'serviceDetail.backToServices' | 'serviceDetail.requestQuote'
  | 'serviceDetail.callUs' | 'serviceDetail.differentServices' | 'serviceDetail.projectStart'  
  | 'serviceDetail.guaranteed' | 'serviceDetail.customerSatisfaction' | 'serviceDetail.allOurServices'
  | 'serviceDetail.specializedServices' | 'serviceDetail.allPricesInclude' | 'serviceDetail.availableIn'
  | 'serviceDetail.previous' | 'serviceDetail.next' | 'serviceDetail.customersAlsoBook'
  | 'serviceDetail.relatedServices' | 'serviceDetail.relatedService' | 'serviceDetail.readyToStart'
  | 'serviceDetail.contactToday' | 'serviceDetail.requestFreeQuote' | 'serviceDetail.quickStart'
  | 'serviceDetail.canStartWithin' | 'serviceDetail.secureGuarantee' | 'serviceDetail.yearsGuarantee'
   | 'serviceDetail.days' | 'serviceDetail.discount' | 'serviceDetail.taxAndInsurance' | 'serviceDetail.startWithinDays'
   | 'serviceDetail.rotRutHandling' | 'serviceDetail.weHandleAll'
  
  // Project visualization texts
  | 'project.eco_performance' | 'project.ai_results' | 'project.environmental_impact'
  | 'project.rot_rut_optimization'
  
  // Pages
  | 'pages.about.title' | 'pages.about.subtitle' | 'pages.about.history_title'
  | 'pages.about.history_text' | 'pages.about.customers' | 'pages.about.days_start'
  | 'pages.about.years_exp' | 'pages.references.title'
  | 'pages.servicesOverview.title' | 'pages.servicesOverview.titleHighlight' 
  | 'pages.servicesOverview.subtitle' | 'pages.servicesOverview.seeMore' 
  | 'pages.servicesOverview.cantFind' | 'pages.servicesOverview.seeAll'
  | 'pages.auth.loginFailed' | 'pages.auth.unknownError' | 'pages.auth.tryAgain'
  | 'pages.auth.backHome' | 'pages.auth.needHelp' | 'pages.auth.contactUs'
  
   // Contact Page Extended
   | 'pages.contact.bookVisit'

  // Contact Page
  | 'pages.contact.title' | 'pages.contact.subtitle' | 'pages.contact.quickResponse'
  | 'pages.contact.quickResponseDesc' | 'pages.contact.freeQuote' | 'pages.contact.freeQuoteDesc'
  | 'pages.contact.localService' | 'pages.contact.localServiceDesc' | 'pages.contact.requestQuote'
  | 'pages.contact.formDescription' | 'pages.contact.name' | 'pages.contact.phone'
  | 'pages.contact.email' | 'pages.contact.address' | 'pages.contact.serviceType'
  | 'pages.contact.selectService' | 'pages.contact.projectDescription' | 'pages.contact.projectPlaceholder'
  | 'pages.contact.sendRequest' | 'pages.contact.sending' | 'pages.contact.consent'
  | 'pages.contact.contactInfo' | 'pages.contact.telephone' | 'pages.contact.callNow'
  | 'pages.contact.emailContact' | 'pages.contact.responseTime' | 'pages.contact.operatingArea'
  | 'pages.contact.areaDesc' | 'pages.contact.openingHours' | 'pages.contact.mondayFriday'
  | 'pages.contact.saturday' | 'pages.contact.sunday' | 'pages.contact.closed'
  | 'pages.contact.emergencyService' | 'pages.contact.emergencyDesc' | 'pages.contact.whyChoose'
  | 'pages.contact.startIn24h' | 'pages.contact.rotDeduction' | 'pages.contact.guaranteedQuality'
  | 'pages.contact.freeQuotes' | 'pages.contact.fieldsMissing' | 'pages.contact.fillAllFields'
  | 'pages.contact.thankYou' | 'pages.contact.responseIn24h' | 'pages.contact.somethingWrong'
  | 'pages.contact.tryAgain'

  // FAQ Page
  | 'pages.faq.title' | 'pages.faq.subtitle' | 'pages.faq.askQuestion' | 'pages.faq.callUs'
  | 'pages.faq.rotPrices' | 'pages.faq.bookingTime' | 'pages.faq.qualityGuarantee'
  | 'pages.faq.practicalQuestions' | 'pages.faq.noAnswer' | 'pages.faq.contactUs'
  | 'pages.faq.sendMessage'

  // About Page Extended
  | 'pages.about.values' | 'pages.about.speed' | 'pages.about.speedDesc'
  | 'pages.about.quality' | 'pages.about.qualityDesc' | 'pages.about.transparency'
  | 'pages.about.transparencyDesc' | 'pages.about.coverageArea' | 'pages.about.coverageDesc'
  | 'pages.about.readyToStart' | 'pages.about.contactToday'

  // Privacy Page
  | 'pages.privacy.title' | 'pages.privacy.description'

  // Terms Page  
  | 'pages.terms.title' | 'pages.terms.description'

  // ROT Info Page
  | 'pages.rot.title' | 'pages.rot.subtitle' 
  | 'pages.rot.hero.title' | 'pages.rot.hero.subtitle' | 'pages.rot.hero.bookVisit' | 'pages.rot.hero.phone'
  | 'pages.rot.what.title' | 'pages.rot.what.description1' | 'pages.rot.what.description2'
  | 'pages.rot.what.benefit1' | 'pages.rot.what.benefit2' | 'pages.rot.what.benefit3' | 'pages.rot.what.benefit4'
  | 'pages.rot.what.discount' | 'pages.rot.what.discountDescription'
  | 'pages.rot.examples.title' | 'pages.rot.examples.service1' | 'pages.rot.examples.service2' | 'pages.rot.examples.service3'
  | 'pages.rot.examples.work1' | 'pages.rot.examples.work2' | 'pages.rot.examples.work3'
  | 'pages.rot.examples.savings' | 'pages.rot.examples.price' | 'pages.rot.examples.withRot'
  | 'pages.rot.process.title' | 'pages.rot.process.step1.title' | 'pages.rot.process.step1.description'
  | 'pages.rot.process.step2.title' | 'pages.rot.process.step2.description'
  | 'pages.rot.process.step3.title' | 'pages.rot.process.step3.description'
  | 'pages.rot.qualifies.title' | 'pages.rot.qualifies.yes.title' | 'pages.rot.qualifies.no.title'
  | 'pages.rot.cta.title' | 'pages.rot.cta.description' | 'pages.rot.cta.bookNow' | 'pages.rot.cta.requestQuote'

  // RUT Info Page
  | 'pages.rut.title' | 'pages.rut.subtitle' 
  | 'pages.rut.hero.title' | 'pages.rut.hero.subtitle' | 'pages.rut.hero.bookVisit' | 'pages.rut.hero.phone'
  | 'pages.rut.what.title' | 'pages.rut.what.description1' | 'pages.rut.what.description2'
  | 'pages.rut.what.benefit1' | 'pages.rut.what.benefit2' | 'pages.rut.what.benefit3' | 'pages.rut.what.benefit4'
  | 'pages.rut.what.discount' | 'pages.rut.what.discountDescription'
  | 'pages.rut.examples.title' | 'pages.rut.examples.service1' | 'pages.rut.examples.service2' | 'pages.rut.examples.service3'
   | 'pages.rut.examples.work1' | 'pages.rut.examples.work2' | 'pages.rut.examples.work3'
   | 'pages.rut.examples.savings' | 'pages.rut.examples.price' | 'pages.rut.examples.withRut'
   | 'pages.rut.process.title' | 'pages.rut.process.step1.title' | 'pages.rut.process.step1.description'
   | 'pages.rut.process.step2.title' | 'pages.rut.process.step2.description'
   | 'pages.rut.process.step3.title' | 'pages.rut.process.step3.description'
   | 'pages.rut.qualifies.title' | 'pages.rut.qualifies.yes.title' | 'pages.rut.qualifies.no.title'
   | 'pages.rut.cta.title' | 'pages.rut.cta.description' | 'pages.rut.cta.bookNow' | 'pages.rut.cta.requestQuote'
   | 'home.comparison.title' | 'home.comparison.subtitle'
   | 'home.services.title' | 'home.services.subtitle' | 'home.services.viewAll'
   | 'home.hero.title' | 'home.hero.subtitle' | 'home.hero.primaryCta'
   | 'home.finalCta.title' | 'home.finalCta.subtitle' | 'home.finalCta.primaryButton' | 'home.finalCta.secondaryButton'
   | 'services.el.title' | 'services.el.description'
   | 'services.vvs.title' | 'services.vvs.description'
   | 'services.snickeri.title' | 'services.snickeri.description'
   | 'services.montering.title' | 'services.montering.description'
   | 'services.tradgard.title' | 'services.tradgard.description'
   | 'services.stadning.title' | 'services.stadning.description'
   | 'services.flytt.title' | 'services.flytt.description'
   | 'services.category.main'
   | 'location.uppsala_stockholm' | 'location.national_large_projects'
   | 'timing.start_within_5_days' | 'timing.less_than_5_days'
   | 'comparison.coverage_area' | 'comparison.limited' | 'comparison.5_10_days'
   | 'comparison.coverage_description' | 'comparison.timing_description'
   | 'comparison.start_time' | 'comparison.header' | 'comparison.competitors'
   | 'trust.f_tax' | 'trust.f_tax_desc' | 'trust.insured' | 'trust.insured_desc'
   | 'trust.fast_start' | 'trust.fast_start_desc' | 'trust.fixed_price' | 'trust.fixed_price_desc'
   | 'trust.rating' | 'trust.rating_desc' | 'trust.coverage' | 'trust.coverage_desc'
   | 'hero.title_large' | 'hero.title_or' | 'hero.title_small' | 'hero.title_projects'
   | 'hero.subtitle' | 'hero.fixco_handles' | 'hero.everything'
   | 'hero.cta_request_quote' | 'hero.cta_see_services' | 'hero.trust_rot' | 'hero.trust_rot_desc'
   | 'hero.trust_coverage' | 'hero.trust_coverage_desc' | 'hero.trust_start' | 'hero.trust_start_desc'
   | 'comparison.price_title' | 'comparison.price_rot_desc' | 'comparison.price_no_rot_desc'
   // Additional comparison terms
   | 'comparison.customer_satisfaction' | 'comparison.customer_satisfaction_desc'
   | 'comparison.rut_handling' | 'comparison.rut_handling_fixco' | 'comparison.rut_handling_competitor'
   | 'comparison.rut_handling_desc' | 'comparison.project_completion' | 'comparison.project_completion_desc'
   | 'comparison.wins_all' | 'comparison.market_leader' | 'comparison.start_time_label'
   | 'comparison.satisfied_customers' | 'comparison.support' | 'comparison.request_quote'
   
   // AI Page
   | 'ai.page_title' | 'ai.page_subtitle' | 'ai.powered_by' | 'ai.hero_title' | 'ai.hero_subtitle'
   | 'ai.chat_title' | 'ai.chat_greeting' | 'ai.chat_error' | 'ai.chat_placeholder' | 'ai.chat_send'
   | 'ai.image_title' | 'ai.image_subtitle' | 'ai.image_upload' | 'ai.image_choose' | 'ai.image_max_size'
   | 'ai.image_instruction_placeholder' | 'ai.image_generate' | 'ai.image_generating' | 'ai.image_result'
   | 'ai.image_before' | 'ai.image_after' | 'ai.image_download' | 'ai.image_disclaimer'
   | 'ai.image_file_too_large' | 'ai.image_missing_info' | 'ai.image_missing_desc' | 'ai.image_complete'
   | 'ai.image_complete_desc' | 'ai.image_error' | 'ai.quote_title' | 'ai.quote_subtitle'
   | 'ai.quote_service' | 'ai.quote_choose_service' | 'ai.quote_quantity' | 'ai.quote_material'
   | 'ai.quote_work' | 'ai.quote_subtotal' | 'ai.quote_vat' | 'ai.quote_total_incl_vat'
   | 'ai.quote_rot_deduction' | 'ai.quote_after_rot' | 'ai.quote_create_pdf' | 'ai.quote_generating'
   | 'ai.quote_email_placeholder' | 'ai.quote_send' | 'ai.quote_disclaimer' | 'ai.quote_pdf_created'
   | 'ai.quote_pdf_desc' | 'ai.quote_sent' | 'ai.quote_sent_desc' | 'ai.quote_missing_email'
   | 'ai.quote_fill_email' | 'ai.quote_pdf_error' | 'ai.quote_pdf_error_desc' | 'ai.quote_email_error'
   | 'ai.quote_email_error_desc' | 'ai.feature1_title' | 'ai.feature1_desc' | 'ai.feature2_title'
   | 'ai.feature2_desc' | 'ai.feature3_title' | 'ai.feature3_desc' | 'ai.disclaimer_title'
   | 'ai.disclaimer_text'
   | 'comparison.see_all_services' | 'comparison.days' | 'comparison.within_days';