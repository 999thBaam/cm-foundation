import { DottedSurface } from '@/components/ui/dotted-surface';
import { cn } from '@/lib/utils';

/**
 * Demo page showcasing the DottedSurface component
 * Displays an animated 3D dotted surface with centered text
 */
export default function DemoDottedSurface() {
    return (
        <div className="relative size-full min-h-screen">
            <DottedSurface className="size-full" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div
                    aria-hidden="true"
                    className={cn(
                        'pointer-events-none absolute -top-10 left-1/2 size-full -translate-x-1/2 rounded-full',
                        'bg-[radial-gradient(ellipse_at_center,--theme(--color-foreground/.1),transparent_50%)]',
                        'blur-[30px]',
                    )}
                />
                <h1 className="font-mono text-4xl font-semibold">Dotted Surface</h1>
            </div>
        </div>
    );
}
