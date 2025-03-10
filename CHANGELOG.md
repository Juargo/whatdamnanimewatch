# Changelog

## [0.1.0](https://github.com/Juargo/whatdamnanimewatch/compare/v0.0.1...v0.1.0) (2025-03-10)


### Features

* **backend:** agregar paginación y conteo de animes en la ruta de franquicias; incluir animes standalone ([00b678d](https://github.com/Juargo/whatdamnanimewatch/commit/00b678dd0f9cd50794a5d2b9c26fb40537591e9c))
* **backend:** inicializar Prisma con manejo de errores y agregar filtrado por letra en la ruta de franquicias ([402fae8](https://github.com/Juargo/whatdamnanimewatch/commit/402fae8c24b453c0485a4ed5434a5765f31faf4a))
* **database:** Actualización de dependencias y modificación del esquema de la tabla Anime ([9d84b08](https://github.com/Juargo/whatdamnanimewatch/commit/9d84b0810ef172a9db90e1fc7af5145bf743b319))
* **database:** actualizar dependencias de Prisma y agregar lógica para asignar IDs de franquicia a animes ([06b5440](https://github.com/Juargo/whatdamnanimewatch/commit/06b5440f8f97135d2b7ceaf0eddb482630a5d4d5))
* **database:** agregar campo 'franchise' a la tabla Anime y actualizar dependencias; mejorar componentes de AnimeCard y AnimeList ([d2a0a77](https://github.com/Juargo/whatdamnanimewatch/commit/d2a0a77c0b867c8306f109a8644e93178c9212de))
* **database:** agregar columna 'imagen' a la tabla Franquicia y añadir script para parsear animes ([1485938](https://github.com/Juargo/whatdamnanimewatch/commit/14859382548c048f7d6748c33222c30de4ce1135))
* **database:** agregar endpoint para obtener animes por ID de franquicia ([454952d](https://github.com/Juargo/whatdamnanimewatch/commit/454952de73e895c93c6893b7db4d2a01e43eb16e))
* **database:** agregar modelos relacionales para Franquicia, Genero, Demografia y Pais; actualizar lógica de inserción de animes ([910b66a](https://github.com/Juargo/whatdamnanimewatch/commit/910b66a75ca2e086c0e2d355664a60e385998191))
* **database:** agregar restricciones únicas a las tablas Franquicia, Genero, Demografia y Pais; actualizar dependencias y mejorar scripts de manejo de animes ([42c8aee](https://github.com/Juargo/whatdamnanimewatch/commit/42c8aeeb339e6700caf3c37475417519d44d8344))
* **database:** Configuración inicial de Prisma y PostgreSQL ([510c99d](https://github.com/Juargo/whatdamnanimewatch/commit/510c99d13638a966212328df9c3367f474f4c2ec))
* **database:** mejorar la lógica de obtención e inserción de animes; filtrar duplicados y manejar errores de manera más robusta ([64dc505](https://github.com/Juargo/whatdamnanimewatch/commit/64dc505d649e7f0a98f1c65d41a395cf53657333))
* **database:** Mejoras en la estructura de los datos ([4187ca2](https://github.com/Juargo/whatdamnanimewatch/commit/4187ca2a6aea74c5314e6d14237f5451fa0f0a5d))
* **database:** Renombrar interfaz MyAnimeBase a MyAnimeData y ajustar tipos de datos; agregar p-limit como dependencia ([0d4a3f6](https://github.com/Juargo/whatdamnanimewatch/commit/0d4a3f6704fa8ca22ef7b7e5fe63e5882a81b587))
* **database:** script que recolecta data desde animelist ([fb26360](https://github.com/Juargo/whatdamnanimewatch/commit/fb26360168e702c66e351fa3cd1ca449f1fbcb59))
* **frontend:** agregar componente FranquiciaList y FranquiciaCard para mostrar franquicias con imágenes y cantidad de animes ([57ee407](https://github.com/Juargo/whatdamnanimewatch/commit/57ee4079eb3467fd1c1bedb2d95d9f66e4159a37))
* **frontend:** agregar componentes FranchiseList y FranchiseCard, y crear página FranchisePage para mostrar franquicias y sus animes ([454952d](https://github.com/Juargo/whatdamnanimewatch/commit/454952de73e895c93c6893b7db4d2a01e43eb16e))
* **frontend:** agregar configuración de Tailwind CSS y componentes de Anime; eliminar archivos no utilizados ([e276010](https://github.com/Juargo/whatdamnanimewatch/commit/e276010aec9f3cc88404d654fe14bf1ea28c292a))
* **frontend:** agregar filtrado de franquicias por letra y mejorar la interfaz de selección ([666cbbd](https://github.com/Juargo/whatdamnanimewatch/commit/666cbbdc3e4c356ff0be9ad9a9f648e18b6dfa71))
* **frontend:** aumentar el tamaño de fuente en la cantidad de animes en FranchiseCard ([763b0bf](https://github.com/Juargo/whatdamnanimewatch/commit/763b0bf013bcdf4a89e16ebcfa87ab0821bc34ed))
* **frontend:** mejorar componente AnimeCard con colores de estado y ajustes de diseño; actualizar límite de fetch en AnimeList y modificar URL base en fetchAnimes ([7de67e5](https://github.com/Juargo/whatdamnanimewatch/commit/7de67e5fd12e8257db50f96c8586d2b9d8280c48))
* **frontend:** refactor AnimeList, FranchiseCard y FranchiseList para mejorar la presentación y la estructura del código ([c975592](https://github.com/Juargo/whatdamnanimewatch/commit/c97559211814f614c17d3f3cb8348487d9db78bf))


### Bug Fixes

* **lint:** se corrigen types ([1af18a2](https://github.com/Juargo/whatdamnanimewatch/commit/1af18a2cc428fb7e08b0d34191df3ddba0fd7f65))
