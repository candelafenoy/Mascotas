-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 23-06-2026 a las 16:45:29
-- Versión del servidor: 10.4.24-MariaDB
-- Versión de PHP: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `mascotas`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `condicionesprevias`
--

CREATE TABLE `condicionesprevias` (
  `ID_Condicion` bigint(20) UNSIGNED NOT NULL,
  `ID_Mascota` bigint(20) UNSIGNED NOT NULL,
  `Condicion` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `condicionesprevias`
--

INSERT INTO `condicionesprevias` (`ID_Condicion`, `ID_Mascota`, `Condicion`) VALUES
(1, 1, 'alergia'),
(2, 2, 'vomitos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `consulta`
--

CREATE TABLE `consulta` (
  `ID_Consulta` bigint(20) UNSIGNED NOT NULL,
  `FechaYHora` datetime NOT NULL,
  `Motivo` text NOT NULL,
  `ID_Veterinario` bigint(20) UNSIGNED NOT NULL,
  `ID_Mascota` bigint(20) UNSIGNED NOT NULL,
  `Diagnostico` text DEFAULT NULL,
  `Tratamiento` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `consulta`
--

INSERT INTO `consulta` (`ID_Consulta`, `FechaYHora`, `Motivo`, `ID_Veterinario`, `ID_Mascota`, `Diagnostico`, `Tratamiento`) VALUES
(1, '2026-06-23 11:30:00', 'picazon constante luego del baño', 1, 1, 'alergia al shampoo', 'pastillas para la alergia y utilizar productos aptos al bañar'),
(2, '2026-06-26 17:45:00', 'vomitos recurrentes', 2, 2, 'indefinido', 'antiinflamatorio, dieta y control en 48hs');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mascota`
--

CREATE TABLE `mascota` (
  `ID_Mascota` bigint(20) UNSIGNED NOT NULL,
  `Nombre` text NOT NULL,
  `Especie` text NOT NULL,
  `Raza` text NOT NULL,
  `Edad` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `mascota`
--

INSERT INTO `mascota` (`ID_Mascota`, `Nombre`, `Especie`, `Raza`, `Edad`) VALUES
(1, 'floki', 'perro', 'mestizo', '2022-04-04'),
(2, 'mora', 'perro', 'mestiza', '2015-02-02'),
(3, 'dinamita', 'perro', 'pitbull', '2025-11-12');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medicamento`
--

CREATE TABLE `medicamento` (
  `ID_Medicamento` bigint(20) UNSIGNED NOT NULL,
  `Nombre` text NOT NULL,
  `Tipo` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `medicamento`
--

INSERT INTO `medicamento` (`ID_Medicamento`, `Nombre`, `Tipo`) VALUES
(1, 'loradatadina', 'antihistamínico '),
(2, 'meloxicam', 'antiinflamatorio');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prescripcion`
--

CREATE TABLE `prescripcion` (
  `ID_Prescripcion` bigint(20) UNSIGNED NOT NULL,
  `Dosis` bigint(20) NOT NULL,
  `Frecuencia` bigint(20) NOT NULL,
  `Duración` bigint(20) NOT NULL,
  `ReacciónAdversa` text DEFAULT NULL,
  `ID_Consulta` bigint(20) UNSIGNED NOT NULL,
  `ID_Medicamento` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `prescripcion`
--

INSERT INTO `prescripcion` (`ID_Prescripcion`, `Dosis`, `Frecuencia`, `Duración`, `ReacciónAdversa`, `ID_Consulta`, `ID_Medicamento`) VALUES
(1, 1, 8, 7, NULL, 2, 2),
(2, 1, 12, 7, NULL, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `propietario`
--

CREATE TABLE `propietario` (
  `ID_Propietario` bigint(20) UNSIGNED NOT NULL,
  `Nombre` text NOT NULL,
  `DNIdelPropietario` bigint(20) NOT NULL,
  `NumeroDeContacto` bigint(20) NOT NULL,
  `Calle` text NOT NULL,
  `Altura` bigint(20) NOT NULL,
  `Piso` bigint(20) NOT NULL,
  `Localidad` text NOT NULL,
  `CodigoPostal` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `propietario`
--

INSERT INTO `propietario` (`ID_Propietario`, `Nombre`, `DNIdelPropietario`, `NumeroDeContacto`, `Calle`, `Altura`, `Piso`, `Localidad`, `CodigoPostal`) VALUES
(1, 'belen fenoy', 39123456, 1136851059, 'pio diaz', 862, 1, 'saenz peña', 1674),
(2, 'stella gonzalez', 21476362, 1141565644, 'uruguay ', 3276, 0, 'saenz peña', 1674),
(3, 'candela fenoy', 43901464, 1138606090, 'uruguay', 3276, 0, 'saenz peña', 1674);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `propietario_mascota`
--

CREATE TABLE `propietario_mascota` (
  `ID_PropietarioMascota` bigint(20) UNSIGNED NOT NULL,
  `ID_Propietario` bigint(20) UNSIGNED NOT NULL,
  `ID_Mascota` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `propietario_mascota`
--

INSERT INTO `propietario_mascota` (`ID_PropietarioMascota`, `ID_Propietario`, `ID_Mascota`) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `veterinario`
--

CREATE TABLE `veterinario` (
  `ID_Veterinario` bigint(20) UNSIGNED NOT NULL,
  `Nombre` text NOT NULL,
  `Matrícula` bigint(20) NOT NULL,
  `Especialidad` text NOT NULL,
  `HorariosDeAtencion` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `veterinario`
--

INSERT INTO `veterinario` (`ID_Veterinario`, `Nombre`, `Matrícula`, `Especialidad`, `HorariosDeAtencion`) VALUES
(1, 'Sergio Medina', 112233, 'dermatologia', '09:00:00'),
(2, 'Martina Lampone', 556677, 'medicina general', '14:00:00');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `condicionesprevias`
--
ALTER TABLE `condicionesprevias`
  ADD PRIMARY KEY (`ID_Condicion`),
  ADD KEY `condicionesprevias_id_mascota_foreign` (`ID_Mascota`);

--
-- Indices de la tabla `consulta`
--
ALTER TABLE `consulta`
  ADD PRIMARY KEY (`ID_Consulta`),
  ADD KEY `consulta_id_veterinario_foreign` (`ID_Veterinario`),
  ADD KEY `consulta_id_mascota_foreign` (`ID_Mascota`);

--
-- Indices de la tabla `mascota`
--
ALTER TABLE `mascota`
  ADD PRIMARY KEY (`ID_Mascota`);

--
-- Indices de la tabla `medicamento`
--
ALTER TABLE `medicamento`
  ADD PRIMARY KEY (`ID_Medicamento`);

--
-- Indices de la tabla `prescripcion`
--
ALTER TABLE `prescripcion`
  ADD PRIMARY KEY (`ID_Prescripcion`),
  ADD KEY `prescripcion_id_medicamento_foreign` (`ID_Medicamento`),
  ADD KEY `prescripcion_id_consulta_foreign` (`ID_Consulta`);

--
-- Indices de la tabla `propietario`
--
ALTER TABLE `propietario`
  ADD PRIMARY KEY (`ID_Propietario`),
  ADD UNIQUE KEY `propietario_dnidelpropietario_unique` (`DNIdelPropietario`);

--
-- Indices de la tabla `propietario_mascota`
--
ALTER TABLE `propietario_mascota`
  ADD PRIMARY KEY (`ID_PropietarioMascota`),
  ADD KEY `propietario_mascota_id_mascota_foreign` (`ID_Mascota`),
  ADD KEY `propietario_mascota_id_propietario_foreign` (`ID_Propietario`);

--
-- Indices de la tabla `veterinario`
--
ALTER TABLE `veterinario`
  ADD PRIMARY KEY (`ID_Veterinario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `condicionesprevias`
--
ALTER TABLE `condicionesprevias`
  MODIFY `ID_Condicion` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `consulta`
--
ALTER TABLE `consulta`
  MODIFY `ID_Consulta` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `mascota`
--
ALTER TABLE `mascota`
  MODIFY `ID_Mascota` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `medicamento`
--
ALTER TABLE `medicamento`
  MODIFY `ID_Medicamento` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `prescripcion`
--
ALTER TABLE `prescripcion`
  MODIFY `ID_Prescripcion` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `propietario`
--
ALTER TABLE `propietario`
  MODIFY `ID_Propietario` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `propietario_mascota`
--
ALTER TABLE `propietario_mascota`
  MODIFY `ID_PropietarioMascota` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `veterinario`
--
ALTER TABLE `veterinario`
  MODIFY `ID_Veterinario` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `condicionesprevias`
--
ALTER TABLE `condicionesprevias`
  ADD CONSTRAINT `condicionesprevias_id_mascota_foreign` FOREIGN KEY (`ID_Mascota`) REFERENCES `mascota` (`ID_Mascota`);

--
-- Filtros para la tabla `consulta`
--
ALTER TABLE `consulta`
  ADD CONSTRAINT `consulta_id_mascota_foreign` FOREIGN KEY (`ID_Mascota`) REFERENCES `mascota` (`ID_Mascota`),
  ADD CONSTRAINT `consulta_id_veterinario_foreign` FOREIGN KEY (`ID_Veterinario`) REFERENCES `veterinario` (`ID_Veterinario`);

--
-- Filtros para la tabla `prescripcion`
--
ALTER TABLE `prescripcion`
  ADD CONSTRAINT `prescripcion_id_consulta_foreign` FOREIGN KEY (`ID_Consulta`) REFERENCES `consulta` (`ID_Consulta`),
  ADD CONSTRAINT `prescripcion_id_medicamento_foreign` FOREIGN KEY (`ID_Medicamento`) REFERENCES `medicamento` (`ID_Medicamento`);

--
-- Filtros para la tabla `propietario_mascota`
--
ALTER TABLE `propietario_mascota`
  ADD CONSTRAINT `propietario_mascota_id_mascota_foreign` FOREIGN KEY (`ID_Mascota`) REFERENCES `mascota` (`ID_Mascota`),
  ADD CONSTRAINT `propietario_mascota_id_propietario_foreign` FOREIGN KEY (`ID_Propietario`) REFERENCES `propietario` (`ID_Propietario`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
