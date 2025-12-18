/**
 * Padroniza a extração de mensagens de erro de diferentes fontes (Supabase, JS Error, String).
 * @param error O objeto de erro recebido (unknown).
 * @param context Uma string descrevendo onde o erro ocorreu (ex: "Login", "Carregar Ferramentas").
 * @returns Uma mensagem de erro amigável e formatada para o usuário.
 */
export const handleError = (error: unknown, context: string): string => {
    let message = 'Ocorreu um erro inesperado.';
    let details = '';

    if (error instanceof Error) {
        message = error.message;
    } else if (typeof error === 'object' && error !== null) {
        // Tenta extrair mensagem de objetos de erro estilo Supabase ou API
        if ('message' in error) {
            message = String((error as any).message);
        }
        if ('details' in error) {
            details = String((error as any).details);
        }
    } else if (typeof error === 'string') {
        message = error;
    }

    // Log detalhado para desenvolvimento
    if (message.includes('Supabase desativado para reset.')) { // Esta condição não deve mais ocorrer com o cliente real
        console.warn(`[Aviso em ${context}]:`, message, details, error);
    } else {
        console.error(`[Erro em ${context}]:`, message, details, error);
    }
    
    // Retorna mensagem limpa para UI
    return message;
};
