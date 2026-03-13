# Component Creation Patterns

Este documento define os padrões para criação de componentes de UI no projeto.

## Tecnologias
- **Tailwind CSS 4.0**: Estilização baseada em utilitários.
- **Tailwind Variants (TV)**: Gerenciamento de variantes e estados.
- **React (Next.js)**: Framework base.

## Regras de Ouro
1. **Named Exports**: Sempre use exportações nomeadas. Nunca use `export default`.
2. **Extensão de Props**: Sempre estenda as propriedades nativas do elemento HTML correspondente (ex: `ComponentProps<'button'>`).
3. **Variantes com TV**: Use a biblioteca `tailwind-variants` para definir `base`, `variants` e `defaultVariants`.
4. **Merge de Classes**: Sempre use o utilitário `cn` (que usa `twMerge`) para combinar classes. Mesmo ao usar `tailwind-variants`, prefira envolver o resultado com `cn` se houver um `className` externo: `className={cn(style({ variant }), className)}`.
5. **Variáveis de CSS**: Defina tokens de design (cores, fontes, etc) no `src/app/globals.css` usando o bloco `@theme` do Tailwind 4.


## Exemplo de Estrutura

```tsx
import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

const style = tv({
  base: '...',
  variants: {
    variant: { ... }
  }
});

export interface Props extends ComponentProps<'div'>, VariantProps<typeof style> {}

export function MyComponent({ className, variant, ...props }: Props) {
  return (
    <div className={cn(style({ variant }), className)} {...props} />
  );
}
```
