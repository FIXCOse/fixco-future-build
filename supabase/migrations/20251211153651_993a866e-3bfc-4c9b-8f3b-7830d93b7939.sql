-- Uppdatera Heather Wests offert Q-2025-028 med korrekta beräkningar
-- Enligt Limont-faktura: 60.4 tim × 900 kr (inkl moms) = 54,360 kr
-- Rabatt 15%: 8,154 kr
-- Summa efter rabatt: 46,206 kr
-- ROT 50%: 23,103 kr
-- Att betala: 23,103 kr

UPDATE public.quotes_new 
SET 
  vat_included = true,
  discount_type = 'percent',
  discount_value = 15,
  discount_amount_sek = 8154,
  vat_sek = 9241,
  rot_deduction_sek = 23103,
  rot_percentage = 50,
  total_sek = 23103
WHERE id = '948eab1a-d3dd-49b1-9403-75ba791a54d0';