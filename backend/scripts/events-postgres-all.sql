-- Migración de eventos MySQL → PostgreSQL
-- Generado automáticamente

-- Limpiar tabla (opcional, descomenta si quieres borrar eventos existentes)
-- DELETE FROM events;

-- Insertar eventos migrados
INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  6, 'PorciFORUM 2022', '20220209logo-porciforum2022_color.png', '2022-03-23', '2022-03-24', 
  '15:30', '15:30', '2', 'Palacio de congresos La Llotja, Lleida, EspaÃ±a', 'PorciFORUM 2022 mÃ¡s renovado que nunca. Vuelve en su 7ma ediciÃ³n comprometidos con el sector porcino.\r\n', 
  1, '4', '1', 'https://porciforum.info/', 'porciforum-2022', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  9, 'IPPE 2025', '20220214ippe logo.png', '2025-01-28', '2025-01-30', 
  '17:15', '17:15', '1', 'Georgia World Congress Center, Atlanta, USA', 'International Production & Processing Expo (IPPE) regresa con mÃ¡s de 1,400 expositores', 
  1, '2', '1', 'www.ippexpo.org', 'ippe-2025', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  10, 'NutriFORUM 2022', '20220214logo-nutriforum2022_color (1).jpg', '2022-04-20', '2022-04-21', 
  '9:45', '14:00', '3', 'La Llotja, Lleida, EspaÃ±a', 'Vuelve la 6ta ediciÃ³n del NutriFORUM para seguir aportando al sector y definiendo la nutriciÃ³n animal.', 
  1, '4', '1', 'https://nutriforum.info/', 'nutriforum-2022', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  13, 'ILDEX Vietnam', '20220214ildex vietnam.png', '2022-08-03', '2022-08-05', 
  '12:00', '12:00', '5', 'Ciudad Ho Chi Minh, Vietnam', 'Feria de ganado, productos lÃ¡cteos, procesamiento de carne y de la acuicultura', 
  1, '1', '2', 'ildex.com.vn/en/home', 'ildex-vietnam', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  14, 'WBC 2022', '20220214wbc madrid.png', '2022-09-04', '2022-09-08', 
  '17:30', '17:30', '4', 'Madrid', 'El espacio para reunir a veterinarios trabajando en ganado lechero y vacuno y otros rumiantes, cientÃ­ficos de universidades e institutos de investigaciÃ³n, asesores de medicina de producciÃ³n, profesionales', 
  1, '4', '1', 'https://www.wbc-madrid2022.com/index.php/es/', 'wbc-2022', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  15, 'VICTAM and Animal Health and Nutrition Asia 2022', '20220214victam asia.png', '2022-09-07', '2022-09-09', 
  '', '', '1', 'BITEC, Bangkok', 'presentando las novedades de empresas de Tailandia e internacionales relacionadas con los sectores de Agricultura, GanaderÃ­a, ExposiciÃ³n animales, Procesamiento de alimentos', 
  1, '1', '1', 'https://vivhealthandnutrition.nl/', 'victam-and-animal-health-and-nutrition-asia-2022', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  16, 'ALIMENTARIA 2022', '20220214alimentaria 2022.png', '2022-04-04', '2022-04-07', 
  '', '', '1', 'Fira de Barcelona', 'Un evento para potenciar su carÃ¡cter empresarial, proyectar la gastronomÃ­a con su valor diferencial y a expresar las Ãºltimas tendencias en la producciÃ³n y consumo de alimentos y bebidas.', 
  1, '4', '2', 'https://www.alimentaria.com/', 'alimentaria-2022', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  17, 'VIV Europe 2022', '20220214viv europe 2022 (1).png', '2022-05-31', '2022-06-02', 
  '17:45', '17:45', '1', 'Utrecht, Netherlands', 'ExposiciÃ³n internacional para la crÃ­a de animales y procesamiento de los animales. La feria presenta las Ãºltimas soluciones, tendencias y tecnologÃ­as para la crÃ­a y el procesamiento.', 
  1, '4', '2', 'www.viveurope.nl', 'viv-europe-2022', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  18, 'Mediterranean Poultry Summit (7th edition)', '20220214meditarranean summit 2022.png', '2022-06-08', '2022-06-10', 
  '17:45', '17:45', '1', 'Universidad de CÃ³rdoba', 'La 7Âª convocatoria de esta â€œCumbre AvÃ­cola MediterrÃ¡neaâ€ que tiene por objetivo tratar de los principales problemas que afectan a los sectores avÃ­colas de este regiÃ³n.', 
  1, '4', '1', 'http://www.mpn-wpsa.org/', 'mediterranean-poultry-summit-7th-edition', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  19, '26th Worldâ€™s Poultry Congress', '2022021426th Worldâ€™s Poultry Congress.png', '2022-08-07', '2022-08-11', 
  '17:45', '17:45', '1', 'Palacio de congresos Paris, Francia', 'Evento dedicado especialmente para las Redes AvÃ­colas MediterrÃ¡neas y Africanas. El programa integrarÃ¡ varios enfoques para abordar un desafÃ­o complejo, como por ejemplo salud, bienestar y reproducciÃ³n o nutriciÃ³n, eficiencia e impacto ambiental o tecnologÃ­a para nuevos productos alimenticios avÃ­colas', 
  1, '4', '1', 'https://wpcparis2021.com/', '26th-worlds-poultry-congress', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  20, 'Ovum 2022', '20220214ovum 2022.png', '2022-09-06', '2022-09-09', 
  '', '', '1', 'San Pedro Sula, Honduras', '27Âº Congreso Latinoamericano de Avicultura que convoca a la comunidad latinoamericana y mundial', 
  1, '2', '1', '', 'ovum-2022', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  21, 'International EGG Business Conference', '20220214International EGG Business Conference.png', '2022-04-25', '2022-04-27', 
  '', '', '1', 'The Hague, Netherlands Holanda', 'La ComisiÃ³n internacional del huevo se compromete a apoyar el desarrollo de la globalizaciÃ³n industria del huevo y ofrece una serie de eventos como parte de su programa de alcance regional', 
  1, '4', '1', 'https://www.internationalegg.com/', 'international-egg-business-conference', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  22, 'ESPN 2023, Italy', '20220214ESPN italy 2023.png', '2023-06-21', '2023-06-24', 
  '18:00', '18:00', '1', 'Palacongressi di Rimini, Italia', '23Âº Simposio Europeo sobre NutriciÃ³n AvÃ­cola se llevarÃ¡ a cabo en el Palacongressi di Rimini, Italia. El organizador del simposio es la rama italiana de la AsociaciÃ³n Mundial de Ciencias AvÃ­colas.', 
  1, '4', '1', 'www.espn2022.eu', 'espn-2023-italy', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  23, 'EUROTIER 2022', '20220214eurotier 2022.png', '2022-11-15', '2022-11-18', 
  '', '', '1', 'Hannover, Alemania', 'la EUROTIER se lleva a cabo cada dos aÃ±os, es ampliamente reconocida como la exposiciÃ³n mÃ¡s grande del mundo para ganaderos y sector de producciÃ³n animal en genera', 
  1, '4', '1', 'https://www.eurotier.com/', 'eurotier-2022', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  24, 'AvÃ­cola en conjunto con porcino', '20220214avicola con porcino 2022.png', '2022-03-09', '2022-03-11', 
  '18:15', '18:15', '1', 'Buenos Aires, Argentina', 'encuentro de negocios que esperan todos los profesionales y colegas de la industria para capacitarse, y conocer las ultimas tendencias e innovaciones de estos dos sectores pujantes que reunirÃ¡n en esta ediciÃ³n, a mÃ¡s de 160 empresas de Argentina y el mundo.', 
  1, '2', '1', 'https://www.avicola.com.ar/', 'avicola-en-conjunto-con-porcino', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  25, 'Jornadas de investigaciÃ³n porcina', '20220214journees-recherche-porcine.png', '2023-01-31', '2023-02-01', 
  '', '', '2', 'Espace Reuilly, Paris, Francia', 'Congreso sobre la actualidad tÃ©cnica y econÃ³mica de la producciÃ³n porcina', 
  1, '4', '1', 'www.journees-recherche-porcine.com', 'jornadas-de-investigacion-porcina', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  26, 'Opormex', '20220214opormex.png', '2022-05-04', '2022-05-07', 
  '', '', '2', 'Riviera Maya, MÃ©xico', 'Congreso Mexicano de Porcicultores', 
  1, '2', '1', 'congresopormex.com', 'opormex', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  27, 'OFC 2022 ', '20220214ofc 2022.png', '2022-01-05', '2022-01-07', 
  '', '', '2', 'Oxford, Reino Unido', 'La Oxford Farming Confrerence es una conferencia anual para los granjeros de UK que toma lugar en Oxford.', 
  1, '4', '1', 'https://www.ofc.org.uk/', 'ofc-2022', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  28, 'Agros Expo 2022', '20220214agros .png', '2022-01-25', '2022-01-27', 
  '', '', '2', 'San petersburgo, Rusia', 'Feria internacional especializada en tecnologÃ­a para producciÃ³n animal y cultivo de alimento.', 
  1, '4', '1', 'https://en.agros-expo.com/', 'agros-expo-2022', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  29, 'Agromek', '20220214agromek 2022.png', '2022-11-29', '2022-12-02', 
  '17:30', '17:30', '2', 'MCH Messecenter Herning, Dinamarca', 'La exposiciÃ³n se lleva a cabo cada dos aÃ±os en MCH Messecenter Herning. La feria es un importante lugar de encuentro para la industria agrÃ­cola, sus proveedores, clientes y socios comerciales. AquÃ­, todo se reÃºne en una feria unida con siete sectores.', 
  1, '4', '1', 'https://www.agromek.com/', 'agromek', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  30, 'SIAL Paris 2022', '20220214SIAL Paris 2022.png', '2022-10-15', '2022-10-19', 
  '', '', '2', 'Paris Nord Villepinte, FranÃ§a', 'A lo largo del SIAL, ParÃ­s serÃ¡ una fuente de inspiraciÃ³n para toda la comunidad gastronÃ³mica. Descubra las Ãºltimas tendencias e innovaciones, conozca a los socios comerciales adecuados para usted y supere juntos los desafÃ­os que enfrenta la industria.', 
  1, '4', '2', 'https://www.sialparis.com/', 'sial-paris-2022', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  31, 'SPACE 2022', '20220214space 2022.png', '2022-09-13', '2022-09-15', 
  '', '', '2', 'Parc-Expo de Rennes, FranÃ§a', 'La SPACE es una feria profesional de la agricultura que reÃºne a todos los los actores del sector vacuno (leche y carne), avÃ­cola, porcina, cunÃ­cola, ovina, caprina y acuÃ­cola.', 
  1, '4', '2', 'https://es.space.fr/', 'space-2022', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  32, 'Intl. Conference on Antimicrobial Agents in Veterinary Medicine', '20220214Intl. Conference on Antimicrobial Agents in Veterinary Medicine.png', '2022-09-11', '2022-09-14', 
  '', '', '2', 'MeliÃ¡ Castilla Hotel & Convention Center, Madrid, Espanya', 'UndÃ©cima Conferencia Internacional sobre Agentes Antimicrobianos en Medicina Veterinaria (AAVM) se celebrarÃ¡ en Madrid en septiembre de 2022', 
  1, '4', '1', 'https://www.aavmconference.com/', 'intl-conference-on-antimicrobial-agents-in-veterinary-medicine', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  33, 'XXIV Jornadas de Porcino de la UAB y la AVPC', '20220214XXIV Jornadas de Porcino de la UAB y la AVPC.png', '2022-01-26', '2022-01-28', 
  '', '', '2', 'Universidad AutÃ³noma de Barcelona', 'Una presentaciÃ³n de casos clÃ­nicos de porcino', 
  1, '4', '1', '', 'xxiv-jornadas-de-porcino-de-la-uab-y-la-avpc', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  34, 'International Symposium on Wild Boar and Other Suids', '20220214International Symposium on Wild Boar and Other Suids.png', '2022-09-06', '2022-09-09', 
  '', '', '2', 'Seva, Barcelona, EspaÃ±a', 'El simposio incluirÃ¡ sesiones temÃ¡ticas que abarcarÃ¡n la biologÃ­a y la eco-etologÃ­a del jabalÃ­, asÃ­ como prÃ¡cticas de gestiÃ³n, estrategias de control de la poblaciÃ³n y mÃ©todos de mitigaciÃ³n de daÃ±os.', 
  1, '4', '1', 'https://wildboarsymposium.com/', 'international-symposium-on-wild-boar-and-other-suids', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  35, '73rd EAAP Annual Meeting', '2022021473rd EAAP Annual Meeting.png', '2022-09-05', '2022-09-08', 
  '', '', '2', 'Centro de Congresos de AlfÃ¢ndega, Porto, Portugal', 'el programa abarcarÃ¡ diversas Ã¡reas de conocimiento, como nutriciÃ³n, genÃ©tica, fisiologÃ­a, salud y bienestar animal, sistemas ganaderos, ganaderÃ­a de precisiÃ³n, producciÃ³n y uso de insectos, producciÃ³n bovina, equina, porcina, ovina y caprina.', 
  1, '4', '1', 'https://eaap2022.org/', '73rd-eaap-annual-meeting', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  36, 'Fieragricola 2022', '20220214Fieragricola 2022.png', '2022-03-02', '2022-03-05', 
  '', '', '2', 'Verona, Italia', 'Feria internacional para el sector agrÃ­cola. Se compone de varios sub-ferias y por lo tanto cubre toda el Ã¡rea: las tecnologÃ­as agrÃ­colas, equipamiento para la ganaderÃ­a, la agricultura de materiales, energÃ­as renovables y los servicios para el sector agrÃ­cola.', 
  1, '4', '2', 'https://www.fieragricola.it/en', 'fieragricola-2022', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  37, 'Prodexpo 2022', '20220214Prodexpo 2022.png', '2022-02-07', '2022-02-11', 
  '', '', '2', 'Expocentre Fairgrounds, Moscow, Russia', 'Feria internacional sobre el sector de comidas y bebidas', 
  1, '4', '1', 'https://www.prod-expo.ru/en/', 'prodexpo-2022', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  38, '10th European Conference on Precision Livestock Farming 2022', '2022021410th European Conference on Precision Livestock Farming 2022.png', '2022-08-29', '2022-09-02', 
  '', '', '4', 'University of Veterinary Medicine Vienna, Ã€ustria', 'Congreso Europeo de GanaderÃ­a y Conferencia Internacional de GanaderÃ­a Lechera\r\n', 
  1, '4', '1', 'https://www.vetmeduni.ac.at/ecplf2022', '10th-european-conference-on-precision-livestock-farming-2022', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  39, 'Salon International de l Agriculture', '20220222salon.jpg', '2022-02-26', '2022-03-06', 
  '10:30', '10:30', '2', 'Paris, Porte de Versailles', 'La Feria Anual Internacional de Agricultura, es la oportunidad de reunir a diferentes sectores de la agricultura y conectar con una audiencia diversa. Annuel SalÃ³n Internacional de la Agricultura es el principal foro para el intercambio y el diÃ¡logo entre campo y ciudad.', 
  1, '4', '2', 'https://en.salon-agriculture.com/', 'salon-international-de-lagriculture', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  40, 'Leipzig Veterinary Congress', '20220214Leipzig Veterinary Congress.png', '2022-07-07', '2022-07-09', 
  '', '', '2', 'Leipzig, Alemanya', 'El Congreso Veterinario de Leipzig es el mayor evento de formaciÃ³n continua en medicina veterinaria del mundo de habla alemana. SÃ³lo en Leipzig los veterinarios de todas las disciplinas y otros grupos profesionales veterinarios reciben una amplia oferta tanto en el congreso como en la feria vetexpo, que se centra tanto en temas especÃ­ficos de las especies animales como en temas interdisciplinarios.\r\n\r\n', 
  1, '4', '2', 'https://www.tieraerztekongress.de/', 'leipzig-veterinary-congress', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  41, 'Meat Attraction 2022', '20220214Meat Attraction 2022.png', '2022-03-08', '2022-03-10', 
  '18:15', '', '2', 'Feria de Madrid, EspaÃ±a', 'la feria de la industria cÃ¡rnica que se celebrarÃ¡ del 8 al 10 de marzo de 2022 en Ifema', 
  1, '4', '2', 'https://www.ifema.es/meat-attraction', 'meat-attraction-2022', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  42, 'XII Foro Anvepi', '20220214XII Foro Anvepi.png', '2022-03-09', '2022-03-10', 
  '', '', '2', 'CÃ³rdoba, EspaÃ±a', 'La AsociaciÃ³n Nacional de Veterinarios de Porcino IbÃ©rico (Anvepi) celebra su XII Foro Anvepi en CÃ³rdoba', 
  1, '4', '2', 'http://anvepi.com/index.php?foro=1', 'xii-foro-anvepi', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  43, 'Congreso Internacional de ReproducciÃ³n Porcina', '20220214Congreso Internacional de ReproduccioÌn Porcina.png', '2022-03-30', '2022-03-31', 
  '', '', '2', 'Ciudad de las Artes y las Ciencias de Valencia, EspaÃ±a', 'Un congreso para promover y proteger la salud porcina', 
  1, '4', '1', 'https://www.congresoreproduccion.com/', 'congreso-internacional-de-reproduccion-porcina', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  44, 'ZeroZincSummit2022', '20220214ZeroZincSummit2022.png', '2022-06-22', '2022-06-23', 
  '', '', '2', 'Copenhagen, Dinamarca', 'El destete de los lechones sin el uso de zinc medicinal es un reto al que se enfrentan todos los productores de cerdos europeos. Necesitamos una estrategia alternativa antes de la fecha lÃ­mite de 2022.', 
  1, '4', '1', 'https://www.tilmeld.dk/zerozincsummit2022', 'zerozincsummit2022', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  45, 'SEGES Summit 2023', '20220214SEGES Summit 2023.png', '2023-09-21', '2023-09-23', 
  '', '', '2', 'Crowne Plaza, Copenhagen, Dinamarca', 'La cumbre incluirÃ¡ presentaciones detalladas sobre las Ãºltimas investigaciones relacionadas con la salud y la nutriciÃ³n de los lechones, incluidas las estrategias de alimentaciÃ³n de las cerdas, la inmunizaciÃ³n, la gestiÃ³n de las cerdas y las camadas y la optimizaciÃ³n de los corrales.', 
  1, '4', '1', 'https://www.tilmeld.dk/think2020', 'seges-summit-2023', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  46, '4th European Sustainable Phosphorus Conference 2022 (ESPC4)', '202202144th European Sustainable Phosphorus Conference 2022 (ESPC4).png', '2022-06-20', '2022-06-22', 
  '', '', '3', 'Vienna, Austria', 'Las Conferencias Europeas de FÃ³sforo Sostenible son eventos Ãºnicos que reÃºnen a empresas, partes interesadas, autoridades regionales y nacionales, innovaciÃ³n e investigadores, para debatir las acciones y polÃ­ticas de sostenibilidad del fÃ³sforo y los nutrientes', 
  1, '4', '2', 'https://phosphorusplatform.eu/espc4', '4th-european-sustainable-phosphorus-conference-2022-espc4', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  47, 'Feria de la Industria CÃ¡rnica (FIC)', '20220215Feria de la Industria CaÌrnica (FIC).png', '2022-06-14', '2022-06-17', 
  '9:45', '', '2', 'Rencinto Ferial, CP 37770 Guijuelo, Salamanca, EspaÃ±a', 'La Feria de la Industria CÃ¡rnica de Guijuelo trae noticias, reportajes, entrevistas y resÃºmenes que te mostrarÃ¡n una de las citas del sector mÃ¡s importantes de EspaÃ±a.    ', 
  1, '4', '2', 'http://fic.guijuelo.es/', 'feria-de-la-industria-carnica-fic', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  48, 'BSAS Annual Conference 2022', '20220215BSAS Annual Conference 2022.png', '2022-04-12', '2022-04-14', 
  '', '', '2', 'EMCC, Nottingham, Reino Unido', 'Conferencias que debatirÃ¡n el rol de los animales  en la salud de los humanos y el planeta de manera presencial y online', 
  1, '4', '1', 'https://bsas.org.uk/conference', 'bsas-annual-conference-2022', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  49, 'XI Congreso Mundial del JamÃ³n', '20220215XI Congreso Mundial del JamoÌn.png', '2022-06-08', '2022-06-10', 
  '', '', '2', 'Segovia, EspaÃ±a', 'El XI Congreso Mundial de JamÃ³n se celebrarÃ¡ del 8 al 10 de junio de 2022 en la ciudad de Segovia. Un evento que alcanzÃ³ un extraordinario Ã©xito desde su primera ediciÃ³n en 2001 celebrada en CÃ³rdoba, debido a que ha sabido acercar y compartir los avances y los problemas en un mismo foro, donde participan cientos de operarios del sector.', 
  1, '4', '1', 'http://www.congresomundialdeljamon.es/', 'xi-congreso-mundial-del-jamon', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  50, '11th International Conference on Pig Reproduction (ICPR)', '2022021511th International Conference on Pig Reproduction (ICPR).png', '2022-06-06', '2022-06-08', 
  '', '', '2', 'Belgium, BÃ¨lgica', 'La reuniÃ³n ofrece un ambiente muy colegiado y la oportunidad de conocer e intercambiar ideas con investigadores y especialistas en reproducciÃ³n porcina de renombre internacional, y la oportunidad de establecer contactos con partes interesadas relevantes de todo el mundo.', 
  1, '4', '1', 'https://icpr2022.be/', '11th-international-conference-on-pig-reproduction-icpr', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  51, 'VICTAM International 2022', '20220215VICTAM International 2022.png', '2022-05-31', '2022-06-02', 
  '', '', '3', 'Jaarbeurs, Utrecht, PaÃ­ses Bajos', 'Dedicado a las industrias de procesamiento de alimentos para animales, el evento para las industrias de procesamiento de granos, harina y arroz.', 
  1, '4', '1', 'https://victaminternational.com/', 'victam-international-2022', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  52, 'BOKU Symposium Animal Nutrition', '20220215BOKU Symposium Animal Nutrition.png', '2022-04-28', '2022-04-28', 
  '', '', '2', 'Vienna, Austria', 'Sustancias bioactivas en la nutriciÃ³n animal y funciones del futuro', 
  1, '4', '1', 'https://boku.ac.at/en/ifa-tulln/tte/tte-symposium', 'boku-symposium-animal-nutrition', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  53, 'British Pig & Poultry Fair 2022', '20220215British Pig & Poultry Fair 2022.png', '2022-05-10', '2022-05-11', 
  '13:00', '13:00', '5', 'NAEC Stoneleigh, Reino Unido', ' Un evento que reÃºne a la industria para intercambiar ideas e informaciÃ³n de avicultura y sector porcino', 
  1, '4', '2', 'https://www.pigandpoultry.org.uk/', 'british-pig-and-poultry-fair-2022', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  54, '13th ESPHM', '2022021513th ESPHM (1).png', '2022-05-11', '2022-05-13', 
  '', '', '2', 'Budapest Congress Center, HungrÃ­a', '13Âº Simposio Europeo de GestiÃ³n Sanitaria Porcina', 
  1, '4', '1', 'http://www.esphm2022.org/', '13th-esphm', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  55, 'IFFA 2022', '20220215IFFA 2022.png', '2022-05-14', '2022-05-19', 
  '', '', '2', 'Frankfurt am Main, Alemania', 'IFFA cubre todo el mercado de procesamiento, envasado y venta de carne y proteÃ­nas alternativas. Ofreciendo asÃ­ a la industria alimentaria mundial una plataforma para la innovaciÃ³n y la creaciÃ³n de redes.', 
  1, '4', '1', 'https://iffa.messefrankfurt.com/frankfurt/en.html', 'iffa-2022', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  56, '15th International Symposium on Digestive Physiology of Pigs (DPP2022)', '2022021515th International Symposium on Digestive Physiology of Pigs (DPP2022).png', '2022-05-17', '2022-05-20', 
  '', '', '2', 'De Doelen, Rotterdam, PaÃ­ses Bajos', 'Actualmente, el DPP es considerado uno de los eventos cientÃ­ficos mundiales mÃ¡s importantes en los campos de la nutriciÃ³n y la fisiologÃ­a intestinal porcina.', 
  1, '4', '1', 'https://dpp2022.com/', '15th-international-symposium-on-digestive-physiology-of-pigs-dpp2022', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  57, '14th EPIZONE Annual Meeting', '2022021514th EPIZONE Annual Meeting.png', '2022-05-18', '2022-05-20', 
  '', '', '2', 'World Trade Center, Barcelona, EspaÃ±a', 'la red internacional de institutos de investigaciÃ³n veterinaria que trabajan en enfermedades animales epizoÃ³ticas', 
  1, '4', '1', 'https://www.epizone-eu.net/', '14th-epizone-annual-meeting', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  58, 'XLI Congreso ANAPORC', '20220215XLI Congreso ANAPORC.png', '2022-09-28', '2022-09-29', 
  '', '', '2', 'Palacio de Exposiciones y Congresos de Granada, EspaÃ±a', 'Los miembros de ANAPORC tienen, desde que en el aÃ±o 1980 se celebrase el primer congreso de la asociaciÃ³n, una cita anual que pretende ser fuente de conocimiento y punto de encuentro de profesionales.', 
  1, '4', '1', 'https://www.archivo-anaporc.com/', 'xli-congreso-anaporc', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  59, 'XXVII MVC: Cereals- Mixed Feed- Veterinary', '20220215mvc cereals.png', '2022-06-22', '2022-06-24', 
  '', '', '3', 'Moscow, VDNH, RÃºssia', 'foro profesional en el mundo donde los expertos se reÃºnen para compartir e intercambiar nuevas ideas y conocimientos, construir relaciones a largo plazo y firmar contratos.', 
  1, '4', '1', 'https://www.mvc-expohleb.ru/', 'xxvii-mvc-cereals-mixed-feed-veterinary', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  60, 'Meat and Poultry Industry Russia 2022', '20220215Meat and Poultry Industry Russia 2022.png', '2022-03-15', '2022-03-17', 
  '12:00', '12:00', '5', 'Crocus expo, MoscÃº, Rusia', 'Plataforma industrial para demostrar los desarrollos mÃ¡s avanzados en el campo de la fabricaciÃ³n de productos de alta calidad: desde equipos y tecnologÃ­as para el cultivo y mantenimiento de animales de granja, desde la producciÃ³n de piensos hasta el procesamiento de materias primas', 
  1, '4', '1', 'https://meatindustry.ru/en/', 'meat-and-poultry-industry-russia-2022', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  61, 'Congreso Internacional de Porcicultura 2022', '20220215Congreso Internacional de Porcicultura 2022.png', '2022-07-06', '2022-07-08', 
  '', '', '2', 'Lima, PerÃº', 'EL CONGRESO INTERNACIONAL DE PORCICULTURA 2022 tiene como principal objetivo ser un foro donde se analicen las principales propuestas inherentes al desarrollo y crecimiento la industria porcina, a la vez de ser un medio de acercamiento e interrelaciÃ³n de todos los agentes comprometidos con su desarrollo.', 
  1, '2', '1', 'https://www.ciporc.com/', 'congreso-internacional-de-porcicultura-2022', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  62, 'Brazil Pork Expo 2022', '20220215porkexpo brasil.png', '2022-10-26', '2022-10-27', 
  '', '', '2', 'Foz do Iguazu, Brasil', 'PORKEXPO se consolida como el mayor evento de crianza porcina en Brasil', 
  1, '2', '2', 'https://porkexpo.com.br/', 'brazil-pork-expo-2022', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  64, 'VII WORKSHOP SINDIAVIPAR', '20220215sindiavipar.png', '2022-11-23', '2022-11-24', 
  '', '', '1', 'Centro de eventos Medianeira, ParanÃ¡, Brasil', 'Evento para destacar la importancia de la conexiÃ³n entre innovaciÃ³n, mercado y avicultura serÃ¡ debatida entre los dÃ­as 23 y 24 de noviembre de 2022', 
  1, '2', '1', 'https://sindiavipar.com.br/', 'vii-workshop-sindiavipar', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  78, 'PorciFORUM 2022', '20220209logo-porciforum2022_color.png', '2022-03-23', '2022-03-24', 
  '15:30', '15:30', '2', 'Palacio de congresos La Llotja, Lleida, EspaÃ±a', 'PorciFORUM 2022 more renewed than ever. It returns in its 7th edition committed to the pig sector.', 
  1, '4', '1', 'https://porciforum.info/', 'porciforum-2022', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  79, 'PorciFORUM 2022', '20220209logo-porciforum2022_color.png', '2022-03-23', '2022-03-24', 
  '15:30', '15:30', '2', 'Palacio de congresos La Llotja, Lleida, EspaÃ±a', 'PorciFORUM 2022 mais renovado do que nunca. Retorna em sua 7Âª ediÃ§Ã£o comprometido com o setor suÃ­no.', 
  1, '4', '1', 'https://porciforum.info/', 'porciforum-2022', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  80, 'Show Rural da Coopavel', '20220209SRC-logo.jpg', '2022-02-07', '2022-02-11', 
  '8:30', '19:30', '1', 'BR-277 Km 577 - Cascavel (PR) Brasil', 'O Show Rural Coopavel Ã© um evento de difusÃ£o de tecnologia agropecuÃ¡ria que acontece anualmente no municÃ­pio brasileiro de Cascavel, no estado do ParanÃ¡. Maior feira do agronegÃ³cio da AmÃ©rica Latina e terceira do mundo, tem como objetivo aumentar a produtividade de pequenas, mÃ©dias e grandes propriedades rurais. ', 
  1, '2', '2', 'https://showrural.com.br/', 'show-rural-da-coopavel', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  81, 'XIX Congresso de Ovos de ProduÃ§Ã£o e ComercializaÃ§Ã£o de Ovos ', '20220209Logo_congresso.png', '2022-03-22', '2022-03-24', 
  '8:00', '20:00', '1', 'Centro de ConvenÃ§Ãµes de RibeirÃ£o Preto (SP) - Brasil', 'Em 2022, o Congresso de Ovos da APA (AssociaÃ§Ã£o Paulista de Avicultura) chega Ã  XIX ediÃ§Ã£o. Com o apoio da FundaÃ§Ã£o APINCO, a programaÃ§Ã£o do evento Ã© pensada para atualizar os atores do setor de avicultura de postura. O evento tambÃ©m Ã© se apresenta como uma excelente oportunidade para network, sendo uma referÃªncia entre os eventos da avicultura de postura brasileira.', 
  1, '2', '1', 'http://www.congressodeovos.com.br', 'xix-congresso-de-ovos-de-producao-e-comercializacao-de-ovos', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  82, 'Aves & SuÃ­nos 360', '20220209LOGO-AVES---SUINOS-360-LIMPO(1).jpg', '2022-03-31', '2022-04-01', 
  '13:00', '20:30', '1', 'R. OlimpÃ­adas, 205 - Vila OlÃ­mpia, SÃ£o Paulo - SP, 04551-000', 'O Aves & SuÃ­nos 360Âº â€“ Summit 2022 Ã© organizado pela Originale Eventos e Turismo, que conta com mais de 30 anos participando e organizando eventos do segmento, como AveExpo, PorkExpo, alÃ©m de eventos corporativos das empresas Agroceres, Nutron-Cargill, OuroFino SaÃºde Animal, Vaxxinova, Dechra, Alltech, Nutripura, Zinpro, Elanco, Phibro e Campo RaÃ§Ãµes.', 
  1, '2', '1', 'https://avesesuinos360.com.br', 'aves-and-suinos-360', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  87, 'XV SimpÃ³sio Goiano de Avicultura', '20220209Simposio-goiano-logo.jpeg', '2022-06-09', '2022-06-10', 
  '8:00', '18:00', '1', 'Castros Park Hotel - GoiÃ¢nia (GO) - Brasil', 'O XV SimpÃ³sio Goiano de Avicultura estÃ¡ confirmado para acontecer presencialmente nos dias 9 e 10 de junho deste ano, no Castros Park Hotel, em GoiÃ¢nia (GO).\r\n\r\nO encontro vai reunir lideranÃ§as da avicultura de corte e de postura para debater os principais desafios e oportunidades para a cadeia produtiva, anunciou o diretor TÃ©cnico da AGA (AssociaÃ§Ã£o Goiana de Avicultura) e professor da UFG (Universidade Federal de GoiÃ¡s), Marcos Barcellos CafÃ©.\r\n\r\nA expectativa Ã© reunir cerca de 300 participantes, entre produtores, empresÃ¡rios, mÃ©dicos veterinÃ¡rios, zootecnistas e pesquisadores, alÃ©m das principais empresas do setor.\r\n\r\nâ€œA programaÃ§Ã£o tÃ©cnica-cientÃ­fica foi cuidadosamente selecionada para atender as expectativas das empresas e dos profissionais que atuam na avicultura goiana. SÃ£o temas atuais e relacionados aos principais entraves e desafios da nossa Ã¡reaâ€, pontuou o especialista.\r\n\r\nEle salienta que a escolha dos temas envolve uma ampla consulta entre empresas, fornecedores e profissionais dos diferentes segmentos da avicultura.\r\n\r\nâ€œA comissÃ£o organizadora busca balancear os assuntos para atender todas as Ã¡reas da avicultura. Assim, conseguimos um programa completo, diversificado e sintonizado com as demandas dos setores produtivos, acadÃªmicos e cientÃ­ficosâ€, encerrou.\r\n\r\nPara esta ediÃ§Ã£o, um dos destaques serÃ¡ o Painel de Abertura, que vai abordar â€œPerspectivas de competitividade na aviculturaâ€ com alguns dos empresÃ¡rios de destaque no setor, como Ricardo Faria, da Granja Faria, e Hugo Garrote, da SÃ£o Salvador Alimentos. Outras informaÃ§Ãµes sobre o encontro podem ser obtidas atravÃ©s do telefone (62) 3203. 3665 ou atravÃ©s do e-mail simposiogoiano@outlook.com.\r\n\r\nCom um total de 119,9 milhÃµes de cabeÃ§as de frango abatidas, GoiÃ¡s bate recorde na sÃ©rie histÃ³rica, no terceiro trimestre de 2021. O total representa aumento de 6,3% em relaÃ§Ã£o ao trimestre anterior e de 7,2% em relaÃ§Ã£o ao mesmo perÃ­odo do ano passado. No acumulado do ano foram 348,3 milhÃµes de cabeÃ§as de frango abatidas, o que representa um crescimento de 16,9% no perÃ­odo.', 
  1, '2', '1', 'https://agagoias.com.br/', 'xv-simposio-goiano-de-avicultura', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  160, 'Fieragricola 2022', '20220214Fieragricola 2022.png', '2022-03-02', '2022-03-05', 
  '', '', '2', 'Verona, Italia', 'Feira internacional do setor agropecuÃ¡rio. Ã‰ constituÃ­da por vÃ¡rias subfeiras e abrange assim toda a Ã¡rea: tecnologias agrÃ­colas, equipamentos para pecuÃ¡ria, materiais agrÃ­colas, energias renovÃ¡veis e serviÃ§os para o setor agrÃ­cola.', 
  1, '4', '2', 'https://www.fieragricola.it/en', 'fieragricola-2022', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  161, 'Prodexpo 2022', '20220214Prodexpo 2022.png', '2022-02-07', '2022-02-11', 
  '', '', '2', 'Expocentre Fairgrounds, Moscow, Russia', 'International trade fair for the food and beverage sector', 
  1, '4', '1', 'https://www.prod-expo.ru/en/', 'prodexpo-2022', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  162, 'Prodexpo 2022', '20220214Prodexpo 2022.png', '2022-02-07', '2022-02-11', 
  '', '', '2', 'Expocentre Fairgrounds, Moscow, Russia', 'Feira internacional do setor de alimentos e bebidas', 
  1, '4', '1', 'https://www.prod-expo.ru/en/', 'prodexpo-2022', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  163, '10th European Conference on Precision Livestock Farming 2022', '2022021410th European Conference on Precision Livestock Farming 2022.png', '2022-08-29', '2022-09-02', 
  '', '', '4', 'University of Veterinary Medicine Vienna, Ã€ustria', 'European Livestock Congress and International Dairy Farming Conference', 
  1, '4', '1', 'https://www.vetmeduni.ac.at/ecplf2022', '10th-european-conference-on-precision-livestock-farming-2022', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  164, '10Âª ConferÃªncia Europeia sobre PecuÃ¡ria de PrecisÃ£o 2022', '2022021410th European Conference on Precision Livestock Farming 2022.png', '2022-08-29', '2022-09-02', 
  '', '', '4', 'University of Veterinary Medicine Vienna, Ã€ustria', 'European Livestock Congress e International Dairy Farming Conference', 
  1, '4', '1', 'https://www.vetmeduni.ac.at/ecplf2022', '10th-european-conference-on-precision-livestock-farming-2022', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  165, 'International Exhibition of Agriculture', '20220228salon.jpg', '2022-02-26', '2022-03-06', 
  '18:30', '18:30', '2', 'Paris, Porte de Versailles', 'The Annual International Agriculture Fair is the opportunity to bring together different sectors of agriculture and connect with a diverse audience. Annual International Exhibition of Agriculture is the main forum for exchange and dialogue between the countryside and the city.', 
  1, '4', '2', 'https://en.salon-agriculture.com/', 'salon-international-de-lagriculture', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  166, 'ExposiÃ§Ã£o Internacional de Agricultura', '20220228salon.jpg', '2022-02-26', '2022-03-06', 
  '10:45', '10:45', '2', 'Paris, Porte de Versailles', 'A Feira Anual Internacional de Agricultura Ã© a oportunidade de reunir diferentes setores da agricultura e conectar-se com um pÃºblico diversificado. A ExposiÃ§Ã£o Internacional de Agricultura Annuel Ã© o principal fÃ³rum de intercÃ¢mbio e diÃ¡logo entre o campo e a cidade.', 
  1, '4', '2', 'https://en.salon-agriculture.com/', 'salon-international-de-lagriculture', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  167, 'Leipzig Veterinary Congress', '20220214Leipzig Veterinary Congress.png', '2022-07-07', '2022-07-09', 
  '', '', '2', 'Leipzig, Alemanya', 'The Leipzig Veterinary Congress is the largest continuing education event in veterinary medicine in the German-speaking world. Only in Leipzig veterinarians of all disciplines and other veterinary professional groups receive a wide offer both at the congress and at the vetexpo fair, which focuses on both animal species-specific and interdisciplinary topics.', 
  1, '4', '2', 'https://www.tieraerztekongress.de/', 'leipzig-veterinary-congress', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  168, 'Congresso VeterinÃ¡rio de Leipzig', '20220214Leipzig Veterinary Congress.png', '2022-07-07', '2022-07-09', 
  '', '', '2', 'Leipzig, Alemanya', 'O Leipzig Veterinary Congress Ã© o maior evento de educaÃ§Ã£o continuada em medicina veterinÃ¡ria no mundo de lÃ­ngua alemÃ£. Somente em Leipzig, veterinÃ¡rios de todas as disciplinas e outros grupos profissionais veterinÃ¡rios recebem uma ampla oferta tanto no congresso quanto na feira vetexpo, que se concentra em tÃ³picos especÃ­ficos de espÃ©cies animais e interdisciplinares.', 
  1, '4', '2', 'https://www.tieraerztekongress.de/', 'leipzig-veterinary-congress', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  169, 'Meat Attraction 2022', '20220214Meat Attraction 2022.png', '2022-03-08', '2022-03-10', 
  '18:15', '', '2', 'Feria de Madrid, EspaÃ±a', 'the meat industry fair to be held from March 8 to 10, 2022 at Ifema', 
  1, '4', '2', 'https://www.ifema.es/meat-attraction', 'meat-attraction-2022', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  170, 'AtraÃ§Ã£o de Carne 2022', '20220214Meat Attraction 2022.png', '2022-03-08', '2022-03-10', 
  '', '', '2', 'Feria de Madrid, EspaÃ±a', 'a feira da indÃºstria da carne serÃ¡ realizada de 8 a 10 de marÃ§o de 2022 na Ifema', 
  1, '4', '2', 'https://www.ifema.es/meat-attraction', 'meat-attraction-2022', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  171, 'XII Anvepi Forum', '20220214XII Foro Anvepi.png', '2022-03-09', '2022-03-10', 
  '', '', '2', 'CÃ³rdoba, EspaÃ±a', 'The National Association of Iberian Pig Veterinarians (Anvepi) celebrates its XII Anvepi Forum in CÃ³rdoba', 
  1, '4', '2', 'http://anvepi.com/index.php?foro=1', 'xii-foro-anvepi', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  172, 'XII FÃ³rum Anvepi', '20220214XII Foro Anvepi.png', '2022-03-09', '2022-03-10', 
  '', '', '2', 'CÃ³rdoba, EspaÃ±a', 'A AssociaÃ§Ã£o Nacional de VeterinÃ¡rios de SuÃ­nos IbÃ©ricos (Anvepi) celebra seu XII FÃ³rum Anvepi em CÃ³rdoba', 
  1, '4', '2', 'http://anvepi.com/index.php?foro=1', 'xii-foro-anvepi', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  173, 'International Congress of Swine Reproduction', '20220214Congreso Internacional de ReproduccioÌn Porcina.png', '2022-03-30', '2022-03-31', 
  '', '', '2', 'Ciudad de las Artes y las Ciencias de Valencia, EspaÃ±a', 'A congress to promote and protect pig health', 
  1, '4', '1', 'https://www.congresoreproduccion.com/', 'congreso-internacional-de-reproduccion-porcina', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  174, 'Congresso Internacional de ReproduÃ§Ã£o SuÃ­na', '20220214Congreso Internacional de ReproduccioÌn Porcina.png', '2022-03-30', '2022-03-31', 
  '', '', '2', 'Ciudad de las Artes y las Ciencias de Valencia, EspaÃ±a', 'Um congresso para promover e proteger a saÃºde dos suÃ­nos', 
  1, '4', '1', 'https://www.congresoreproduccion.com/', 'congreso-internacional-de-reproduccion-porcina', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  175, 'ZeroZincSummit2022', '20220214ZeroZincSummit2022.png', '2022-06-22', '2022-06-23', 
  '', '', '2', 'Copenhagen, Dinamarca', 'Weaning piglets without the use of medicinal zinc is a challenge faced by all European pig farmers. We need an alternative strategy before the 2022 deadline.', 
  1, '4', '1', 'https://www.tilmeld.dk/zerozincsummit2022', 'zerozincsummit2022', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  176, 'ZeroZincSummit2022', '20220214ZeroZincSummit2022.png', '2022-06-22', '2022-06-23', 
  '', '', '2', 'Copenhagen, Dinamarca', 'O desmame de leitÃµes sem o uso de zinco medicinal Ã© um desafio enfrentado por todos os suinocultores europeus. Precisamos de uma estratÃ©gia alternativa antes do prazo de 2022.', 
  1, '4', '1', 'https://www.tilmeld.dk/zerozincsummit2022', 'zerozincsummit2022', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  177, 'SEGES Summit 2023', '20220214SEGES Summit 2023.png', '2023-09-21', '2023-09-23', 
  '', '', '2', 'Crowne Plaza, Copenhagen, Dinamarca', 'The summit will include in-depth presentations on the latest research related to piglet health and nutrition, including sow feeding strategies, immunization, sow and litter management, and pen optimization.', 
  1, '4', '1', 'https://www.tilmeld.dk/think2020', 'seges-summit-2023', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  178, 'CÃºpula SEGES 2023', '20220214SEGES Summit 2023.png', '2023-09-21', '2023-09-23', 
  '', '', '2', 'Crowne Plaza, Copenhagen, Dinamarca', 'A cÃºpula incluirÃ¡ apresentaÃ§Ãµes detalhadas sobre as pesquisas mais recentes relacionadas Ã  saÃºde e nutriÃ§Ã£o de leitÃµes, incluindo estratÃ©gias de alimentaÃ§Ã£o de porcas, imunizaÃ§Ã£o, gerenciamento de porcas e ninhadas e otimizaÃ§Ã£o de currais.', 
  1, '4', '1', 'https://www.tilmeld.dk/think2020', 'seges-summit-2023', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  179, '4th European Sustainable Phosphorus Conference 2022 (ESPC4)', '202202144th European Sustainable Phosphorus Conference 2022 (ESPC4).png', '2022-06-20', '2022-06-22', 
  '', '', '3', 'Vienna, Austria', 'The European Sustainable Phosphorus Conferences are unique events that bring together companies, stakeholders, regional and national authorities, innovation and researchers, to discuss phosphorus and nutrient sustainability actions and policies.', 
  1, '4', '2', 'https://phosphorusplatform.eu/espc4', '4th-european-sustainable-phosphorus-conference-2022-espc4', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  180, '4Âª ConferÃªncia Europeia de FÃ³sforo SustentÃ¡vel 2022 (ESPC4)', '202202144th European Sustainable Phosphorus Conference 2022 (ESPC4).png', '2022-06-20', '2022-06-22', 
  '', '', '3', 'Vienna, Austria', 'As ConferÃªncias Europeias de FÃ³sforo SustentÃ¡vel sÃ£o eventos Ãºnicos que reÃºnem empresas, partes interessadas, autoridades regionais e nacionais, inovaÃ§Ã£o e investigadores, para discutir aÃ§Ãµes e polÃ­ticas de sustentabilidade de fÃ³sforo e nutrientes.', 
  1, '4', '2', 'https://phosphorusplatform.eu/espc4', '4th-european-sustainable-phosphorus-conference-2022-espc4', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  181, 'Meat Industry Fair (FIC)', '20220215Feria de la Industria CaÌrnica (FIC).png', '2022-06-14', '2022-06-17', 
  '9:45', '', '2', 'Rencinto Ferial, CP 37770 Guijuelo, Salamanca, EspaÃ±a', 'The Guijuelo Meat Industry Fair brings news, reports, interviews and summaries that will show you one of the most important events in the sector in Spain.', 
  1, '4', '2', 'http://fic.guijuelo.es/', 'feria-de-la-industria-carnica-fic', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  182, 'Feira da IndÃºstria da Carne (FIC)', '20220215Feria de la Industria CaÌrnica (FIC).png', '2022-06-14', '2022-06-17', 
  '9:45', '', '2', 'Rencinto Ferial, CP 37770 Guijuelo, Salamanca, EspaÃ±a', 'A Feira da IndÃºstria da Carne de Guijuelo traz notÃ­cias, reportagens, entrevistas e resumos que lhe mostrarÃ£o um dos eventos mais importantes do setor na Espanha.', 
  1, '4', '2', 'http://fic.guijuelo.es/', 'feria-de-la-industria-carnica-fic', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  183, 'BSAS Annual Conference 2022', '20220215BSAS Annual Conference 2022.png', '2022-04-12', '2022-04-14', 
  '', '', '2', 'EMCC, Nottingham, Reino Unido', 'Conferences that will debate the role of animals in the health of humans and the planet in person and online', 
  1, '4', '1', 'https://bsas.org.uk/conference', 'bsas-annual-conference-2022', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  184, 'ConferÃªncia Anual BSAS 2022', '20220215BSAS Annual Conference 2022.png', '2022-04-12', '2022-04-14', 
  '', '', '2', 'EMCC, Nottingham, Reino Unido', 'ConferÃªncias que vÃ£o debater o papel dos animais na saÃºde dos humanos e do planeta presencial e online', 
  1, '4', '1', 'https://bsas.org.uk/conference', 'bsas-annual-conference-2022', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  185, 'XI World Ham Congress', '20220215XI Congreso Mundial del JamoÌn.png', '2022-06-08', '2022-06-10', 
  '', '', '2', 'Segovia, EspaÃ±a', 'The XI World Congress of Ham will be held from June 8 to 10, 2022 in the city of Segovia. An event that has achieved extraordinary success since its first edition in 2001 held in CÃ³rdoba, due to the fact that it has been able to bring together and share progress and problems in the same forum, where hundreds of operators from the sector participate.', 
  1, '4', '1', 'http://www.congresomundialdeljamon.es/', 'xi-congreso-mundial-del-jamon', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  186, 'XI Congresso Mundial do Presunto', '20220215XI Congreso Mundial del JamoÌn.png', '2022-06-08', '2022-06-10', 
  '', '', '2', 'Segovia, EspaÃ±a', 'O XI Congresso Mundial de Presunto serÃ¡ realizado de 8 a 10 de junho de 2022 na cidade de SegÃ³via. Um evento que alcanÃ§ou um sucesso extraordinÃ¡rio desde sua primeira ediÃ§Ã£o em 2001, realizada em CÃ³rdoba, pelo fato de ter conseguido reunir e compartilhar avanÃ§os e problemas em um mesmo fÃ³rum, onde participam centenas de operadores do setor.', 
  1, '4', '1', 'http://www.congresomundialdeljamon.es/', 'xi-congreso-mundial-del-jamon', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  187, '11th International Conference on Pig Reproduction (ICPR)', '2022021511th International Conference on Pig Reproduction (ICPR).png', '2022-06-06', '2022-06-08', 
  '', '', '2', 'Belgium, BÃ¨lgica', 'The meeting offers a highly collegial atmosphere and the opportunity to meet and exchange ideas with internationally renowned swine reproduction researchers and specialists, and the opportunity to network with relevant stakeholders from around the world.', 
  1, '4', '1', 'https://icpr2022.be/', '11th-international-conference-on-pig-reproduction-icpr', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  188, '11Âª ConferÃªncia Internacional sobre ReproduÃ§Ã£o SuÃ­na (ICPR)', '2022021511th International Conference on Pig Reproduction (ICPR).png', '2022-06-06', '2022-06-08', 
  '', '', '2', 'Belgium, BÃ¨lgica', 'O encontro oferece uma atmosfera muito colegial e a oportunidade de conhecer e trocar idÃ©ias com pesquisadores e especialistas em reproduÃ§Ã£o suÃ­na de renome internacional, e a oportunidade de interagir com partes interessadas relevantes de todo o mundo.', 
  1, '4', '1', 'https://icpr2022.be/', '11th-international-conference-on-pig-reproduction-icpr', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  189, 'VICTAM International 2022', '20220215VICTAM International 2022.png', '2022-05-31', '2022-06-02', 
  '', '', '3', 'Jaarbeurs, Utrecht, PaÃ­ses Bajos', 'Dedicated to the animal feed processing industries, the event for the grain, flour and rice processing industries.', 
  1, '4', '1', 'https://victaminternational.com/', 'victam-international-2022', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  190, 'VICTAM Internacional 2022', '20220215VICTAM International 2022.png', '2022-05-31', '2022-06-02', 
  '', '', '3', 'Jaarbeurs, Utrecht, PaÃ­ses Bajos', 'Dedicado Ã s indÃºstrias de processamento de raÃ§Ã£o animal, o evento para as indÃºstrias de processamento de grÃ£os, farinha e arroz.', 
  1, '4', '1', 'https://victaminternational.com/', 'victam-international-2022', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  191, 'BOKU Symposium Animal Nutrition', '20220215BOKU Symposium Animal Nutrition.png', '2022-04-28', '2022-04-28', 
  '', '', '2', 'Vienna, Austria', 'Bioactive substances in animal nutrition and functions of the future', 
  1, '4', '1', 'https://boku.ac.at/en/ifa-tulln/tte/tte-symposium', 'boku-symposium-animal-nutrition', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  192, 'BOKU SimpÃ³sio NutriÃ§Ã£o Animal', '20220215BOKU Symposium Animal Nutrition.png', '2022-04-28', '2022-04-28', 
  '', '', '2', 'Vienna, Austria', 'SubstÃ¢ncias bioativas na nutriÃ§Ã£o animal e funÃ§Ãµes do futuro', 
  1, '4', '1', 'https://boku.ac.at/en/ifa-tulln/tte/tte-symposium', 'boku-symposium-animal-nutrition', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  226, '6th Northeast Poultry and Pig Farming Fair', '20220210Feira-avicultura-nordeste-logo.png', '2022-09-22', '2022-09-23', 
  '8:00', '20:00', '1', 'SÃ£o Bento do Una (PE) - Brasil', 'The fair da Avicultura e Suinocultura do Nordeste takes place in SÃ£o Bento do Una (PE), a municipality that is the largest producer of eggs in the Northeast. It is an important event of the Brazilian poultry agenda.', 
  1, '2', '2', '', '6-feira-da-avicultura-e-suinocultura-do-nordeste', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  227, 'FIRA â€“ Fair of the Animal Recycling Industry - Org. OPEN', '20220210fira-feira-reciclagem-animal.PNG', '2022-03-15', '2022-03-17', 
  '14:00', '20:00', '3', 'SÃ£o Paulo - SP', 'It is committing to FIRA â€“ Feira da IndÃºstria da Reciclagem Animal to be a showcase and platform of opportunities for a centennial activity that processes waste from slaughtering animals, such as viscera, bears, sorrows, blood, scales, meat and fat devices as parts two animals to produce farinhas, fats, jellies and blood products, with great benefits for society, drastically reducing or great impact on the environment.', 
  1, '2', '2', 'www.fira.net.br/', 'fira-feira-da-industria-de-reciclagem-animal-org-abra', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  391, 'Aves & SuÃ­nos 360Âº Summit 2023', '20221214BANNER_150x95px.jpg', '2023-03-07', '2022-12-08', 
  '13:00', '12:15', '5', 'Hotel Radisson, Curitiba /PR', 'La reuniÃ³n de los principales tomadores de decisiÃ³n de la AVICULTURA y PORCICULTURA en Brasil. Un espacio para intercambiar conocimientos y tener una NUEVA VISIÃ“N DE NEGOCIO. Una tarde y una maÃ±ana sobre PERSPECTIVA DE MERCADO, SOSTENIBILIDAD y TECNOLOGÃA. Todo lo que necesitas saber para lograr una producciÃ³n eficiente y sostenible: ESG (Environment, Social and Governance) y CERO CARBONO. Uniendo AVICULTURA y PORCICULTURA a travÃ©s del Networking.', 
  0, '2', 'Select type of event', 'https://www.avesesuinos360.com.br/', 'aves-and-suinos-360-summit-2023', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  392, 'Aves & SuÃ­nos 360Âº Summit 2023', '20221214BANNER_32x32.jpg', '2023-03-07', '2022-12-08', 
  '13:00', '12:15', '5', 'Hotel Radisson, Curitiba /PR', 'The meeting of the main decision makers in POULTRY and SWINE FARMING in Brazil. A space to exchange knowledge and have a NEW BUSINESS VISION. An afternoon and morning on MARKET PERSPECTIVE, SUSTAINABILITY and TECHNOLOGY. Everything you need to know to achieve efficient and sustainable production: ESG (Environment, Social and Governance) and CARBON ZERO. Uniting POULTRY and SWINE FARMING through Networking.', 
  0, '2', 'Select type of event', 'https://www.avesesuinos360.com.br/', 'aves-and-suinos-360-summit-2023', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  393, 'PecuÃ¡ria 360Âº Summit 2023', '20221214PecuÃ¡ria-32x32px.jpg', '2023-03-15', '2023-03-16', 
  '13:00', '11:15', '4', 'Hotel Clarion, GoiÃ¢nia/ GO', 'O mercado estÃ¡ mudando e vocÃª?\r\nO encontro dos principais tomadores de decisÃ£o da PECUÃRIA do Brasil.\r\nUm espaÃ§o para trocar conhecimento e ter uma NOVA VISÃƒO DE NEGÃ“CIOS.\r\nUma tarde e manhÃ£ de palestras sobre PERSPECTIVA do MERCADO, SUSTENTABILIDADE e TECNOLOGIA.\r\nTudo que vocÃª precisa saber para atingir uma produÃ§Ã£o eficiente e sustentÃ¡vel: ESG (Environment, Social and Governance)  e CARBONO ZERO. \r\nUnindo a PECUÃRIA atravÃ©s do Networking. \r\n\r\n ', 
  1, '2', '1', 'https://www.pecuaria360.com.br/', 'pecuaria-360-summit-2023', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);

INSERT INTO events (
  id, name, image, "startDate", "endDate", "startTime", "endTime", 
  color, location, description, state, region, tipo, website, 
  slug, status, "languageId", "userId", views, "isRecurring", "isFeatured",
  "createdAt", "updatedAt"
) VALUES (
  394, 'PecuÃ¡ria 360Âº Summit 2023', '20221214Banner-180x180px.jpg', '2023-03-15', '2023-03-16', 
  '13:00', '11:15', '4', 'Hotel Clarion, GoiÃ¢nia/ GO', 'El mercado estÃ¡ cambiando y tÃº? La reuniÃ³n de los principales tomadores de decisiones de la GANADERÃA en Brasil. Un espacio para intercambiar conocimientos y tener una NUEVA VISIÃ“N DE NEGOCIO. Una tarde y maÃ±ana de conferencias sobre PERSPECTIVA DE MERCADO, SOSTENIBILIDAD y TECNOLOGÃA. Todo lo que necesitas saber para lograr una producciÃ³n eficiente y sostenible: ESG (Environment, Social and Governance) y CARBON ZERO. Uniendo GANADERÃA a travÃ©s del Networking.', 
  1, '2', '1', 'https://www.pecuaria360.com.br/', 'pecuaria-360-summit-2023', 'PUBLISHED', 
  1, 1, COALESCE(0, 0), false, false,
  NOW(), NOW()
);


-- Actualizar secuencia de IDs
SELECT setval(pg_get_serial_sequence('events', 'id'), (SELECT MAX(id) FROM events));

-- Crear metadatos SEO para eventos con seo_title
-- (Ejecutar después si se necesita)
