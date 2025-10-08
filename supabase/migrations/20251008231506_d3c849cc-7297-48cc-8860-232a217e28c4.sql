-- Ta bort gamla dubletter som redan har nya motsvarigheter

-- Badrum dubletter
DELETE FROM services WHERE id IN ('badrum-1', 'badrum-2', 'badrum-3', 'badrum-4');

-- Kök dubletter
DELETE FROM services WHERE id IN ('kok-1', 'kok-2', 'kok-3', 'kok-4');

-- Fönster & dörrar dubletter
DELETE FROM services WHERE id IN ('fonster-1', 'fonster-2', 'fonster-3', 'fonster-4', 'fonster-5');

-- Golv dubletter
DELETE FROM services WHERE id IN ('golv-1', 'golv-2', 'golv-3', 'golv-4', 'golv-5');

-- Målning dubletter
DELETE FROM services WHERE id IN ('malning-1', 'malning-2', 'malning-3', 'malning-4', 'malning-5');

-- Takarbeten dubletter
DELETE FROM services WHERE id IN ('tak-1', 'tak-2', 'tak-3', 'tak-4');

-- Ta även bort den konstiga testartjänsten
DELETE FROM services WHERE id = 'snickeri-1759097262189-8sr8p5orb';