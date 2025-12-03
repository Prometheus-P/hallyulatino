export interface DesignRequest {
  title: string;
  description: string;
  category: string;
  countries: string[];
  latamHook: string[];
}

export interface DesignSuggestion {
  palette?: { primary?: string; surface?: string; accent?: string };
  typography?: { heading?: string; body?: string };
  layoutHints?: string[];
  copy?: { headline?: string; cta?: string; hooks?: string[] };
  timestamp: string;
}

export async function requestDesignSuggestion(
  payload: DesignRequest
): Promise<DesignSuggestion> {
  const endpoint = import.meta.env.AI_AGENT_ENDPOINT;
  const key = import.meta.env.AI_AGENT_KEY;

  if (!endpoint || !key) {
    return {
      copy: { headline: payload.title, cta: 'Descubre más', hooks: payload.latamHook },
      palette: { primary: '#9b87f5', accent: '#5dd39e', surface: '#0b1021' },
      layoutHints: ['Mantén hero con CTA visible', 'Destaca hooks para LatAm'],
      timestamp: new Date().toISOString(),
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) {
      throw new Error(`AI agent responded with status ${res.status}`);
    }
    const json = (await res.json()) as DesignSuggestion;
    return {
      ...json,
      timestamp: json.timestamp || new Date().toISOString(),
    };
  } catch (error) {
    clearTimeout(timeout);
    return {
      copy: { headline: payload.title, cta: 'Explora el contenido', hooks: payload.latamHook },
      layoutHints: ['Fallback: usa tema por defecto', 'Ajusta CTA al público local'],
      palette: { primary: '#9b87f5', accent: '#5dd39e', surface: '#0b1021' },
      timestamp: new Date().toISOString(),
    };
  }
}
