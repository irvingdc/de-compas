# Colores de Marca - De Compas

## Paleta de Colores Principal

### Colores Oficiales
- **Amarillo Principal**: `#FFCF06` - Color principal de la marca
- **Negro**: `#000000` - Texto principal y elementos destacados
- **Gris Oscuro**: `#2C2C2C` - Texto secundario y elementos de navegación
- **Gris Claro**: `#E0E0E0` - Fondos y elementos sutiles

## Uso en Tailwind CSS

### Clases de Color Primary (Amarillo)
```css
/* Fondo */
bg-primary-500    /* #FFCF06 */
bg-primary-600    /* #d97706 - hover */
bg-primary-100    /* #fef3c7 - light */

/* Texto */
text-primary-500
text-primary-600
text-primary-700

/* Bordes */
border-primary-500
border-primary-600
```

### Clases de Color Secondary (Gris)
```css
/* Fondo */
bg-secondary-800  /* #2C2C2C */
bg-secondary-900  /* #18181b - hover */

/* Texto */
text-secondary-600  /* Texto secundario */
text-secondary-700  /* Texto con más contraste */
text-secondary-800  /* Texto oscuro */
```

### Clases de Color Neutral (Gris Claro)
```css
/* Fondo */
bg-neutral-50     /* Fondo principal */
bg-neutral-100    /* Fondo hover */
bg-neutral-200    /* #E0E0E0 - bordes */

/* Bordes */
border-neutral-200
border-neutral-300
```

### Clases de Color Brand (Específicos)
```css
/* Colores exactos de la marca */
text-brand-black    /* #000000 */
text-brand-yellow   /* #FFCF06 */
bg-brand-yellow     /* #FFCF06 */
```

## Uso en Material-UI

### Colores del Theme
```typescript
// Primary (Amarillo)
color="primary"           // Para botones principales
theme.palette.primary.main     // #FFCF06

// Secondary (Gris Oscuro)
color="secondary"         // Para botones secundarios
theme.palette.secondary.main   // #2C2C2C

// Texto
theme.palette.text.primary     // #000000
theme.palette.text.secondary   // #2C2C2C
```

## Logos Disponibles

### Logos Horizontales
- `LOGO_HORIZONTAL_BLACK.png` - Para fondos claros
- `LOGO_HORIZONTAL_WHITE.png` - Para fondos oscuros
- `LOGO_HORIZONTAL_YELLOW.png` - Para fondos neutrales

### Logos Verticales
- `LOGO_VERTICAL_BLACK.png` - Para espacios verticales, fondos claros
- `LOGO_VERTICAL_WHITE.png` - Para espacios verticales, fondos oscuros
- `LOGO_VERTICAL_YELLOW.png` - Para espacios verticales, fondos neutrales

### Logos Sin Texto
- `LOGO_NO_TEXT_BLACK.png` - Icono solo, fondos claros
- `LOGO_NO_TEXT_WHITE.png` - Icono solo, fondos oscuros
- `LOGO_NO_TEXT_YELLOW.png` - Icono solo, fondos neutrales

## Recomendaciones de Uso

### Botones
- **Primarios**: Fondo amarillo (`bg-primary-500`) con texto negro (`text-brand-black`)
- **Secundarios**: Fondo gris oscuro (`bg-secondary-800`) con texto blanco
- **Outline**: Borde neutral con texto gris oscuro

### Tarjetas
- Fondo blanco con borde gris claro (`border-neutral-200`)
- Títulos en negro (`text-brand-black`)
- Texto secundario en gris (`text-secondary-600`)

### Navegación
- Fondo blanco con bordes neutrales
- Items activos: fondo amarillo claro con texto oscuro
- Items inactivos: texto gris con hover neutro

### Estados
- **Éxito**: Mantener colores verdes existentes
- **Error**: Mantener colores rojos existentes
- **Advertencia**: Usar variaciones del amarillo principal
- **Info**: Usar grises de la paleta secondary

## Ejemplos de Implementación

```jsx
// Botón principal
<Button
  variant="contained"
  color="primary"
  className="bg-primary-500 text-brand-black hover:bg-primary-600"
>
  Acción Principal
</Button>

// Tarjeta
<div className="bg-white border border-neutral-200 rounded-lg p-6">
  <h3 className="text-brand-black font-semibold mb-2">Título</h3>
  <p className="text-secondary-600">Descripción</p>
</div>

// Navegación activa
<Link className="bg-primary-100 text-primary-700 border-l-4 border-primary-500">
  Item Activo
</Link>
``` 