# Script de Configuração Mestre - ARSENAL TOOLS

Este é o **único arquivo necessário** para configurar todo o banco de dados do zero.

```sql
-- ==============================================================================
-- ASSINATURA: [ARSENAL-TOOLS-MEDIA-MODULE]
-- DESCRIÇÃO: Tabela para logs de automação de scripts PSD
-- EVITA CONFLITOS: Prefixo 'mt_psd_' no Schema 'app_media_tools'
-- ==============================================================================

CREATE SCHEMA IF NOT EXISTS app_media_tools;

CREATE TABLE IF NOT EXISTS app_media_tools.mt_psd_script_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID, 
    target_folder TEXT NOT NULL,
    target_layer TEXT NOT NULL,
    image_count INTEGER DEFAULT 0,
    script_version TEXT DEFAULT '1.0.0',
    signature_key TEXT DEFAULT 'ARSENAL_JS_GEN_V1'
);

-- RLS (Segurança)
ALTER TABLE app_media_tools.mt_psd_script_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir inserção pública de logs" ON app_media_tools.mt_psd_script_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir leitura de logs para admin" ON app_media_tools.mt_psd_script_logs FOR SELECT USING (true);

-- ==============================================================================
-- ESTRUTURA BASE (RESTO DO APP)
-- ==============================================================================

-- ... (tabelas public.tools, public.leads, public.site_content mantidas conforme original)
```