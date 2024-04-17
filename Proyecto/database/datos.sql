INSERT INTO proyecto.USUARIO (usuario, contrasena, nombre, activo, foto) 
VALUES 
('Angelgt3', '123', 'Angel Pérez', true, 'Fotos_Perfil/foto1.jpg');

-- Insertando datos en la tabla CATEGORIA
INSERT INTO proyecto.CATEGORIA (categoria) VALUES 
('Física'),
('Matemáticas'),
('Ciencias Naturales'),
('Lenguaje y Literatura'),
('Historia y Ciencias Sociales'),
('Tecnología Educativa'),
('Arte y Música'),
('Educación Física y Salud'),
('Idiomas'),
('Educación Ambiental y Sostenibilidad');

-- Fisica
INSERT INTO proyecto.RECURSO (titulo, descripcion, fecha, imagen, tipo, ruta, id_categoria) 
VALUES 
('Física Universitaria', 'Libro de texto para estudiantes de física universitaria', '2024-04-16', 'Fotos_Publicadas/FísicaUniversitaria.jpeg', 'Libro', 'https://d1wqtxts1xzle7.cloudfront.net/34422087/fisica_universitaria-libre.pdf?1407828094=&response-content-disposition=inline%3B+filename%3DREVISION_TECNICA_Misael_Flores_Rosas_Dep.pdf&Expires=1713331110&Signature=aY7ajgxUMV4BIaMVSsxIo8JldzZeotg9tarKy-Vtal~h60~iQnnDBKtQKziNk62v7vbNxxEOnjai9YgQUfVmd4tERv1YkcqkJX7hECG44LlvztaQ07fSS3ceSjmEyuwQmLMOwL~lEQK22V3XkYwsngJ9SyHkedlS3mZRmAzX3HoOzDpDGX4lqHaOOcitC~nn4lsTjsA2-mwMN1zrkjE5Cd6esWrTk-BS4WqAUjVCCsVd4pc33aPV4SInOvHuC0RfddasUN5a5cWM5Mre1RFm-nS7B3gD0gchcrzv68QcTEGtHYp0JEmHubVyuhug-1uTQ1d7Xn9Ytk~Vxsy-2F17Ig__&Key-Pair-Id=APKAJLOHF5GGSLRBV4ZA', 1),
('Mecánica Clásica', 'Libro que cubre los principios básicos de la mecánica clásica', '2024-04-16', 'Fotos_Publicadas/MecanicaClasica.jpg', 'Libro', 'https://ricabib.cab.cnea.gov.ar/696/1/mecanica_2.pdf', 1),
('Electromagnetismo', 'Libro que aborda los conceptos de electromagnetismo', '2024-04-16', 'Fotos_Publicadas/Electromagnetismo.png', 'Libro', 'https://d1wqtxts1xzle7.cloudfront.net/57444932/123515810-electromagnetismo-serie-schaum-141007081605-conversion-gate02-libre.pdf?1537877271=&response-content-disposition=inline%3B+filename%3DElectromagnetismo_serie_schaum_141007081.pdf&Expires=1713331394&Signature=Yn4xdxQm0CEBP~MstGKv31hU2egU9eLRESyl4bybL5L8IjdGmUN0qWEDdBa6HUx9l0IDOsqzS6EG8JwFu0pqeTffM7lWCzR8f4a7ZUaSAm-ClxNxvTaWlva0AOTrfQ7V7SIDT3tXXvDXthgSWfAf9agxMWl1LHe1B7s2y81G6M4jEYjHMKH8NM-kp14-lNsXnJaS3PjDPVuvBuX3eF3rxP8esPASiK7ok2gT6y2255EI50GDJXibP-NHZIO87x-kEXNrgWF4B9wnC39sj2NVnqanx71B1nIMieuv9dMFZPKYMcd5zeJpl~QJdmIBMFRAlg0smsw~IdyIHeRyyC2AcQ__&Key-Pair-Id=APKAJLOHF5GGSLRBV4ZA', 1),
('Curso de Física Estadística', 'Libro de texto sobre física estadística', '2024-04-16', 'Fotos_Publicadas/CursodeFísicaEstadística.jpg', 'Libro', 'http://www.publicacions.ub.es/refs/indices/06692.pdf?', 1),
('Física cuántica (Berkeley Physics Course)', 'Introducción a los principios de la física cuántica', '2024-04-16', 'Fotos_Publicadas/Fisicacuantica.jpg', 'Libro', 'https://books.google.es/books?hl=es&lr=&id=48n7DwAAQBAJ&oi=fnd&pg=PR5&dq=F%C3%ADsica+Cu%C3%A1ntica+libro&ots=bN4T3ayVhf&sig=J48lYBC1i8Oq0karyXgH2xtSZCY#v=onepage&q=F%C3%ADsica%20Cu%C3%A1ntica%20libro&f=false', 1);

-- Matemáticas
INSERT INTO proyecto.RECURSO (titulo, descripcion, fecha, imagen, tipo, ruta, id_categoria) 
VALUES 
('Álgebra Lineal', 'Libro de texto sobre álgebra lineal', '2024-04-16', 'Fotos_Publicadas/AlgebraLineal.jpeg', 'Libro', 'https://d1wqtxts1xzle7.cloudfront.net/34672658/5591-Algebra_Lineal_y_sus_Aplicaciones_-_David_C._Lay_-_3ra_Ed.pdf-www.leeydescarga.com.pdf?1410238133=&response-content-disposition=inline%3B+filename%3DMas_libros_gratis_en.pdf&Expires=1713331718&Signature=b8J3jHN9xfSSMzhlQL4r7wpp~CaouEyLZo67HvG1sXeWvJIiov2Mn9ZUW6b~fgncNOQURTg2WX6gAGKa0EpSJE9-UEo5YAezyE3UTvRpUk6u1rMlz-eRD7GRn6tzGwf4h~6KnVXlkpVGVDsq7YBQODKZTWbuBV079xQNNLsvjjftewHIE4RvWj8v0ahwXECrVx1svEJ1FjIEQtE4oo-gLMVkMVU-5Cdrvmgn~0l~0YrwKY3m75QrsWdfnKukPgLEecwFASHVYiliOE-oM2DD5r6U000A562lAN4VVivXPgwBGRKDo03VZE0bjaZA-YdsngvVgb7a7JSPbZidTdZABQ__&Key-Pair-Id=APKAJLOHF5GGSLRBV4ZA', 2),
('Cálculo Diferencial e Integral', 'Libro sobre cálculo diferencial e integral', '2024-04-16', 'Fotos_Publicadas/CalculoDiferencialeIntegral.jpeg', 'Libro', 'http://personal.cimat.mx:8181/~gil/docencia/2012/calculo/calculo_ayres1-5.pdf', 2),
('Teoría de Números', 'Introducción a la teoría de números', '2024-04-16', 'Fotos_Publicadas/TeoriadeNumeros.jpeg', 'Libro', 'https://books.google.es/books?hl=es&lr=&id=t5idOLuDW4wC&oi=fnd&pg=PR9&dq=teor%C3%ADa+de+n%C3%BAmeros+para+principiantes&ots=vObPf83mmU&sig=pOxdbqRbmXKaDjmzIe8gp3g5UQ0#v=onepage&q=teor%C3%ADa%20de%20n%C3%BAmeros%20para%20principiantes&f=false', 2),
('Geometría Euclidiana', 'Libro sobre geometría euclidiana', '2024-04-16', 'Fotos_Publicadas/GeometriaEuclidiana.jpeg', 'Libro', 'https://books.google.es/books?hl=es&lr=&id=e3miEAAAQBAJ&oi=fnd&pg=PP7&dq=Geometr%C3%ADa+Euclidiana+libro&ots=CTLQZiFJlL&sig=Y-kvwBcBaynyzB-oRS9tRNwoyYE#v=onepage&q=Geometr%C3%ADa%20Euclidiana%20libro&f=false', 2),
('Análisis Matemático', 'Libro de análisis matemático', '2024-04-16', 'Fotos_Publicadas/AnalisisMatematico.jpg.jpg', 'Libro', 'https://books.google.es/books?hl=es&lr=&id=-LP1DwAAQBAJ&oi=fnd&pg=PR7&dq=An%C3%A1lisis+Matem%C3%A1tico&ots=AG_XcVbC3T&sig=QiJ4xkQJbIPvgk1wAEYxknvmfAM#v=onepage&q=An%C3%A1lisis%20Matem%C3%A1tico&f=false', 2);

-- Ciencias Naturales
INSERT INTO proyecto.RECURSO (titulo, descripcion, fecha, imagen, tipo, ruta, id_categoria) 
VALUES 
('Biología Celular', 'Libro de biología celular', '2024-04-16', 'Fotos_Publicadas/BiologiaCelular.jpg', 'Libro', 'https://books.google.es/books?hl=es&lr=&id=qrrYZJhrRm4C&oi=fnd&pg=PR16&dq=Biolog%C3%ADa+Celular&ots=6Tu26IOxW3&sig=VGwziEPYQZdu3ch0aV_Yoq5O1m8#v=onepage&q&f=false', 3),
('Una Historia de la Genética', 'Libro sobre principios de genética', '2024-04-16', 'Fotos_Publicadas/UnaHistoriadelaGenética.jpg', 'Libro', 'https://www.unioviedo.es/esr/rgiraldez/Textos/Sturtevant1965.pdf', 3),
('La ecologia del desarrollo humano', 'Libro sobre conceptos básicos de ecología', '2024-04-16', 'Fotos_Publicadas/Laecologiadeldesarrollohumano.jpg', 'Libro', 'https://d1wqtxts1xzle7.cloudfront.net/62987681/Lectura_de_Bronfenbrenner20200417-81461-1ucqco1-libre.pdf?1587123955=&response-content-disposition=inline%3B+filename%3DLectura_de_Bronfenbrenner.pdf&Expires=1713332704&Signature=TTF~eGhhTfAFnnVYgqLkQvdU68ITI4DSKEPSnxk8LbwjJPj0C-dEKJF0WVWJro2q7HfPd5WoYcbyYfD2j0aT-9gX6o4FL5YGsZxf2y4HJBFyiFTfj7jhJlD-Y1n2aK6bmc61mfmFjfarSIYuHLn9014NDEtuOrnY8DdCPmhPjH0QnEaRTN4oX7z-OgIVDSOLhvXflLXXvmWFse0WcnjCQAEz7TkpN5lnDt9eWmAg0~FBVfQh1XvBoaHACeCJJXq7udMz9tERbqJH0tbzxmiOfpykzo1hrzo5~SZTmb8k0s7ITEvMz6O6t~VURntKnSF8pTLnVVZ~qkixkMlaPExnWg__&Key-Pair-Id=APKAJLOHF5GGSLRBV4ZA', 3),
('Anatomía Humana', 'Libro sobre anatomía humana', '2024-04-16', 'Fotos_Publicadas/AnatomiaHumana.jpeg', 'Libro', 'https://books.google.es/books?hl=es&lr=&id=5Rpr4aSnC5gC&oi=fnd&pg=PA1194&dq=Anatom%C3%ADa+Humana&ots=LuLOrExuDz&sig=bSPr0mVrLFZIbKKQ-yFcx5GXxHE#v=onepage&q&f=false', 3),
('Cunningham. Fisiología Veterinaria', 'Libro sobre fisiología humana', '2024-04-16', 'Fotos_Publicadas/Cunningham.FisiologíaVeterinaria.jpg', 'Libro', 'https://books.google.es/books?hl=es&lr=&id=Lu_kDwAAQBAJ&oi=fnd&pg=PP1&dq=Fisiolog%C3%ADa&ots=pKnigWQT_c&sig=WgNFvXNL947OBFCgG3ajXduMqDI#v=onepage&q=Fisiolog%C3%ADa&f=false', 3);

-- Lenguaje y Literatura
INSERT INTO proyecto.RECURSO (titulo, descripcion, fecha, imagen, tipo, ruta, id_categoria) 
VALUES 
('El alquimista', 'Libro de Paulo Coelho', '2024-04-16', 'Fotos_Publicadas/Elalquimista.jpeg', 'Libro', 'https://books.google.es/books?hl=es&lr=&id=lZZCzTM_9PUC&oi=fnd&pg=PT186&dq=El+alquimista&ots=X3FTJZvXas&sig=-mOyIaaLOEXVaG9_kTp-rlwPS1I#v=onepage&q&f=false', 4),
('El perfume', 'Libro de Patrick Süskind', '2024-04-16', 'Fotos_Publicadas/ElPerfume.jpeg', 'Libro', 'https://centroderecursos.educarchile.cl/bitstream/handle/20.500.12246/53274/articles-101789_Archivo.pdf?sequence=1', 4),
('Crónica de una muerte anunciada', 'Libro de Gabriel García Márquez', '2024-04-16', 'Fotos_Publicadas/Crónicadeunamuerteanunciada.jpg', 'Libro', 'https://www.jstor.org/stable/29739696', 4),
('Rayuela', 'Libro de Julio Cortázar', '2024-04-16', 'Fotos_Publicadas/Rayuela.jpg', 'Libro', 'https://books.google.es/books?hl=es&lr=&id=xM9bH5JADdsC&oi=fnd&pg=PA5&dq=Rayuela&ots=Agy-zTGWz2&sig=U-93x6__FaX3FMZWv2Nvgz9msME#v=onepage&q&f=false', 4),
('Cien años de soledad', 'Libro de Gabriel García Márquez', '2024-04-16', 'Fotos_Publicadas/Cienañosdesoledad.jpg', 'Libro', 'https://books.google.es/books?hl=es&lr=&id=-T7FiHLRrZkC&oi=fnd&pg=PR9&dq=Cien+a%C3%B1os+de+soledad&ots=Z5vRwGdRjS&sig=qUCMt37WK8q1RGJAup56tJzTQAs#v=onepage&q=Cien%20a%C3%B1os%20de%20soledad&f=false', 4);

-- Historia y Ciencias Sociales
INSERT INTO proyecto.RECURSO (titulo, descripcion, fecha, imagen, tipo, ruta, id_categoria) 
VALUES 
('El origen de las especies', 'Libro de Charles Darwin', '2024-04-16', 'origen_especies.jpg', 'Libro', 'ruta_origen_especies', 5),
('El arte de la guerra', 'Libro de Sun Tzu', '2024-04-16', 'arte_guerra.jpg', 'Libro', 'ruta_arte_guerra', 5),
('La odisea', 'Libro de Homero', '2024-04-16', 'odisea.jpg', 'Libro', 'ruta_odisea', 5),
('Roma: La biografía de una civilización', 'Libro de Steven Saylor', '2024-04-16', 'roma_biografia.jpg', 'Libro', 'ruta_roma_biografia', 5),
('Breve historia del mundo', 'Libro de Ernst Gombrich', '2024-04-16', 'breve_historia_mundo.jpg', 'Libro', 'ruta_breve_historia_mundo', 5);

-- Tecnología Educativa
INSERT INTO proyecto.RECURSO (titulo, descripcion, fecha, imagen, tipo, ruta, id_categoria) 
VALUES 
('Pedagogía del oprimido', 'Libro de Paulo Freire', '2024-04-16', 'pedagogia_oprimido.jpg', 'Libro', 'ruta_pedagogia_oprimido', 6),
('Aprendizaje visible para los profesores', 'Libro de John Hattie', '2024-04-16', 'aprendizaje_visible_profesores.jpg', 'Libro', 'ruta_aprendizaje_visible_profesores', 6),
('El arte de enseñar a aprender', 'Libro de Antoni Zabala', '2024-04-16', 'arte_enseñar_aprender.jpg', 'Libro', 'ruta_arte_enseñar_aprender', 6),
('Innovación en la enseñanza universitaria', 'Libro de Rafael Morales Gamboa', '2024-04-16', 'innovacion_enseñanza_universitaria.jpg', 'Libro', 'ruta_innovacion_enseñanza_universitaria', 6),
('Metodología de la investigación educativa', 'Libro de Angel Diaz Barriga', '2024-04-16', 'metodologia_investigacion_educativa.jpg', 'Libro', 'ruta_metodologia_investigacion_educativa', 6);

-- Arte y Música
INSERT INTO proyecto.RECURSO (titulo, descripcion, fecha, imagen, tipo, ruta, id_categoria) 
VALUES 
('Historia del arte', 'Libro de Ernst Gombrich', '2024-04-16', 'historia_arte.jpg', 'Libro', 'ruta_historia_arte', 7),
('Cien años de música', 'Libro de Jaime Iglesias', '2024-04-16', 'cien_anios_musica.jpg', 'Libro', 'ruta_cien_anios_musica', 7),
('Arte y percepción visual', 'Libro de Rudolf Arnheim', '2024-04-16', 'arte_percepcion_visual.jpg', 'Libro', 'ruta_arte_percepcion_visual', 7),
('Música, mente y evolución', 'Libro de Nils L. Wallin', '2024-04-16', 'musica_mentey_evolucion.jpg', 'Libro', 'ruta_musica_mentey_evolucion', 7),
('El lenguaje secreto del cine', 'Libro de Jean-Claude Carrière', '2024-04-16', 'lenguaje_secreto_cine.jpg', 'Libro', 'ruta_lenguaje_secreto_cine', 7);

-- Educación Física y Salud
INSERT INTO proyecto.RECURSO (titulo, descripcion, fecha, imagen, tipo, ruta, id_categoria) 
VALUES 
('Entrenamiento funcional', 'Libro de Michael Boyle', '2024-04-16', 'entrenamiento_funcional.jpg', 'Libro', 'ruta_entrenamiento_funcional', 8),
('Manual de anatomía para el movimiento', 'Libro de Blandine Calais-Germain', '2024-04-16', 'manual_anatomia_movimiento.jpg', 'Libro', 'ruta_manual_anatomia_movimiento', 8),
('Nutrición deportiva aplicada', 'Libro de Juan Carlos González', '2024-04-16', 'nutricion_deportiva_aplicada.jpg', 'Libro', 'ruta_nutricion_deportiva_aplicada', 8),
('Entrenamiento deportivo', 'Libro de Tudor O. Bompa', '2024-04-16', 'entrenamiento_deportivo.jpg', 'Libro', 'ruta_entrenamiento_deportivo', 8),
('Fisiología del ejercicio', 'Libro de William D. McArdle', '2024-04-16', 'fisiologia_ejercicio.jpg', 'Libro', 'ruta_fisiologia_ejercicio', 8);

INSERT INTO proyecto.RECURSO (titulo, descripcion, fecha, imagen, tipo, ruta, id_categoria) 
VALUES 
('Francés básico', 'Libro para aprender francés desde cero', '2024-04-16', 'frances_basico.jpg', 'Libro', 'ruta_frances_basico', 9),
('Alemán para viajeros', 'Libro para aprender lo básico del alemán para viajar', '2024-04-16', 'aleman_viajeros.jpg', 'Libro', 'ruta_aleman_viajeros', 9),
('Chino mandarín en un mes', 'Libro para aprender lo básico del chino mandarín', '2024-04-16', 'chino_mandarin_mes.jpg', 'Libro', 'ruta_chino_mandarin_mes', 9),
('Italiano para hispanohablantes', 'Libro para aprender italiano desde el español', '2024-04-16', 'italiano_hispanohablantes.jpg', 'Libro', 'ruta_italiano_hispanohablantes', 9),
('Ruso fácil', 'Libro para aprender ruso desde cero', '2024-04-16', 'ruso_facil.jpg', 'Libro', 'ruta_ruso_facil', 9);

-- FAVORITO
INSERT INTO proyecto.FAVORITO (id_usuario, id_recurso) VALUES
(1, 1), -- Física Universitaria
(1, 6), -- Física cuántica (Berkeley Physics Course)
(1, 9); -- El alquimista
