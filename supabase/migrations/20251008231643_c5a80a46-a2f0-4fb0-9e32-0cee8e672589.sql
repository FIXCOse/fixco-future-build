-- Ta bort dubletter - behåll de nyare tjänsterna med beskrivande ID:n

-- Altan dubletter
DELETE FROM services WHERE id IN ('altan-1', 'altan-2', 'altan-3');

-- Akustik dubletter  
DELETE FROM services WHERE id IN ('akustik-1', 'akustik-2');

-- Inredning dubletter
DELETE FROM services WHERE id IN ('inredning-1', 'inredning-2', 'inredning-3');