# Colores de Marca - De Compas

## Paleta de Colores Principal

### Colores Oficiales
- **Amarillo Principal**: `#FFCF06` - Color principal de la marca (igual en ambos modos)
- **Negro**: `#000000` - Texto principal en modo claro
- **Gris Oscuro**: `#2C2C2C` - Texto secundario en modo claro
- **Gris Claro**: `#E0E0E0` - Fondos y elementos sutiles en modo claro

### Colores para Modo Oscuro
- **Fondo Principal**: `#0f0f0f` - Fondo principal oscuro
- **Fondo Secundario**: `#1a1a1a` - Fondo de elementos secundarios
- **Fondo de Tarjetas**: `#262626` - Fondo de tarjetas y componentes
- **Texto Principal**: `#ffffff` - Texto principal en modo oscuro
- **Texto Secundario**: `#d4d4d8` - Texto secundario en modo oscuro
- **Bordes**: `#404040` / `#2a2a2a` - Bordes en modo oscuro

## Sistema de Temas

### Cambio de Tema
La aplicación soporta cambio dinámico entre modo claro y oscuro:

- **Toggle Manual**: Botón en el sidebar para cambiar manualmente
- **Persistencia**: La preferencia se guarda en localStorage
- **Detección Automática**: Detecta preferencia del sistema al primer acceso
- **Transiciones Suaves**: Animaciones de 300ms para cambios

### Componentes del Sistema de Temas

```typescript
// Contexto de Tema
import { useTheme } from './contexts/ThemeContext'

const { mode, toggleTheme, isDark } = useTheme()
```

## Uso en Tailwind CSS

### Clases de Color Primary (Amarillo)
```css
/* Fondo - Igual en ambos modos */
bg-primary-500    /* #FFCF06 */
bg-primary-600    /* #d97706 - hover */
bg-primary-100    /* #fef3c7 - light */

/* Estados activos en modo oscuro */
dark:bg-primary-900    /* Fondo activo oscuro */
dark:text-primary-400  /* Texto activo oscuro */
```

### Clases para Modo Oscuro
```css
/* Fondos */
dark:bg-dark-bg-primary     /* #0f0f0f - Fondo principal */
dark:bg-dark-bg-secondary   /* #1a1a1a - Fondo secundario */
dark:bg-dark-bg-card        /* #262626 - Tarjetas */
dark:bg-dark-bg-hover       /* #333333 - Estados hover */

/* Texto */
dark:text-dark-text-primary    /* #ffffff - Texto principal */
dark:text-dark-text-secondary  /* #d4d4d8 - Texto secundario */
dark:text-dark-text-muted      /* #a1a1aa - Texto deshabilitado */

/* Bordes */
dark:border-dark-border-primary    /* #404040 - Bordes principales */
dark:border-dark-border-secondary  /* #2a2a2a - Bordes secundarios */
```

### Clases Responsivas por Tema
```css
/* Ejemplo de uso combinado */
bg-white dark:bg-dark-bg-card 
text-brand-black dark:text-dark-text-primary
border-neutral-200 dark:border-dark-border-secondary
```

## Uso en Material-UI

### Temas Dinámicos
```typescript
import { createCustomTheme } from './theme'
import { useTheme } from './contexts/ThemeContext'

const { mode } = useTheme()
const muiTheme = createCustomTheme(mode) // 'light' | 'dark'
```

### Colores del Theme por Modo

#### Modo Claro
```typescript
// Primary (Amarillo)
theme.palette.primary.main     // #FFCF06
theme.palette.text.primary     // #000000
theme.palette.background.default // #fafafa
theme.palette.background.paper   // #ffffff
```

#### Modo Oscuro
```typescript
// Primary (Amarillo - igual)
theme.palette.primary.main     // #FFCF06
theme.palette.text.primary     // #ffffff
theme.palette.background.default // #0f0f0f
theme.palette.background.paper   // #262626
```

## Implementación del Toggle

### Componente ThemeToggle
```jsx
import { ThemeToggle } from './components/ThemeToggle'

// En cualquier componente
<ThemeToggle />
```

### Integración Manual
```jsx
import { useTheme } from './contexts/ThemeContext'

const Component = () => {
  const { isDark, toggleTheme } = useTheme()
  
  return (
    <button 
      onClick={toggleTheme}
      className={isDark ? 'dark-styles' : 'light-styles'}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}
```

## Logos por Tema

### Automático por Tema
```jsx
import { useTheme } from './contexts/ThemeContext'

const Logo = () => {
  const { isDark } = useTheme()
  
  return (
    <img 
      src={isDark 
        ? "/assets/LOGO_HORIZONTAL_WHITE.png" 
        : "/assets/LOGO_HORIZONTAL_BLACK.png"
      }
      alt="De Compas" 
    />
  )
}
```

### Logos Disponibles por Tema

#### Modo Claro
- `LOGO_HORIZONTAL_BLACK.png` - Logo horizontal negro
- `LOGO_VERTICAL_BLACK.png` - Logo vertical negro
- `LOGO_NO_TEXT_BLACK.png` - Icono solo negro

#### Modo Oscuro
- `LOGO_HORIZONTAL_WHITE.png` - Logo horizontal blanco
- `LOGO_VERTICAL_WHITE.png` - Logo vertical blanco
- `LOGO_NO_TEXT_WHITE.png` - Icono solo blanco

#### Neutros (Ambos Modos)
- `LOGO_HORIZONTAL_YELLOW.png` - Logo horizontal amarillo
- `LOGO_VERTICAL_YELLOW.png` - Logo vertical amarillo
- `LOGO_NO_TEXT_YELLOW.png` - Icono solo amarillo

## Patrones de Uso Recomendados

### Componentes Adaptativos
```jsx
// ✅ Buena práctica - Adaptativo
<div className="bg-white dark:bg-dark-bg-card border border-neutral-200 dark:border-dark-border-secondary">
  <h3 className="text-brand-black dark:text-dark-text-primary">Título</h3>
  <p className="text-secondary-600 dark:text-dark-text-secondary">Descripción</p>
</div>

// ❌ Evitar - Solo modo claro
<div className="bg-white border border-gray-200">
  <h3 className="text-black">Título</h3>
</div>
```

### Estados de Navegación
```jsx
// Estados activos adaptativos
<Link className={`
  ${isActive 
    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-400' 
    : 'text-secondary-700 dark:text-dark-text-secondary hover:bg-neutral-100 dark:hover:bg-dark-bg-hover'
  }
`}>
```

### Formularios
```jsx
// Inputs adaptativos
<input className="
  bg-white dark:bg-dark-bg-card 
  border-neutral-300 dark:border-dark-border-primary
  text-brand-black dark:text-dark-text-primary
  placeholder-secondary-400 dark:placeholder-dark-text-muted
" />
```

## Configuración CSS

### Transiciones Globales
```css
* {
  transition: 
    background-color 300ms ease,
    border-color 300ms ease,
    color 300ms ease,
    box-shadow 300ms ease;
}
```

### Variables CSS Personalizadas
```css
:root {
  --color-primary: #FFCF06;
  --transition-theme: 300ms ease;
}

.dark {
  --color-bg-primary: #0f0f0f;
  --color-text-primary: #ffffff;
}
```

## Testing de Temas

### Verificación Manual
1. **Toggle Funcional**: El botón cambia entre modos
2. **Persistencia**: Recarga la página mantiene el tema
3. **Logos Adaptativos**: Se muestran logos correctos por tema
4. **Contraste**: Texto legible en ambos modos
5. **Transiciones**: Cambios suaves sin parpadeos

### Herramientas de Desarrollo
```javascript
// Cambiar tema programáticamente (DevTools)
localStorage.setItem('decompas-theme', 'dark')
localStorage.setItem('decompas-theme', 'light')
location.reload()
```

## Mejores Prácticas

### Siempre Incluir Dark Mode
- Todas las clases de color deben tener variante `dark:`
- Usar colores semánticos en lugar de valores específicos
- Probar ambos modos durante desarrollo

### Consistencia Visual
- Mantener el amarillo como color principal en ambos modos
- Usar la misma jerarquía de texto pero con colores adaptativos
- Preservar la marca visual independiente del tema

### Accesibilidad
- Verificar contraste en ambos modos (WCAG 2.1 AA)
- Respetar preferencias del sistema
- Transiciones suaves para usuarios sensibles al movimiento 