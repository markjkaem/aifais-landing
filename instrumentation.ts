export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        await import('./sentry.server.config');
    }

    if (process.env.NEXT_RUNTIME === 'edge') {
        await import('./sentry.edge.config');
    }
}

export const onRequestError = async (
    err: Error,
    request: {
        path: string;
        method: string;
        headers: Record<string, string>;
    },
    context: {
        routerKind: 'Pages Router' | 'App Router';
        routePath: string;
        routeType: 'render' | 'route' | 'action' | 'middleware';
        renderSource?: 'react-server-components' | 'react-server-components-payload' | 'server-rendering';
        revalidateReason?: 'on-demand' | 'stale' | undefined;
        renderType?: 'dynamic' | 'dynamic-resume';
    }
) => {
    const Sentry = await import('@sentry/nextjs');

    Sentry.withScope((scope) => {
        scope.setTag('router.kind', context.routerKind);
        scope.setTag('router.path', context.routePath);
        scope.setTag('router.type', context.routeType);
        scope.setTag('request.method', request.method);
        scope.setExtra('request', {
            path: request.path,
            method: request.method,
        });
        scope.setExtra('context', context);

        Sentry.captureException(err, {
            mechanism: {
                type: 'instrument',
                handled: false,
            },
        });
    });
};
