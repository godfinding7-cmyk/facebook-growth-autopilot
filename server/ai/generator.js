export async function generatePost(candidate, { language = 'Hindi', tone = 'natural' } = {}) {
  const hook = `अभी चर्चा में: ${candidate.title}`;
  const caption = `${hook}\n\nइस खबर/विषय पर पोस्ट करने से पहले source जरूर check करें। नीचे दिए गए original source से facts verify करके ही final पोस्ट publish करें।\n\nआपकी राय क्या है?`;
  return {
    ...candidate,
    language,
    tone,
    hook,
    caption,
    imagePrompt: `Create a clean Facebook news-style social image about: ${candidate.title}. No fake logos, no fabricated quotes, leave safe text space for a short headline.`,
    generatedAt: new Date().toISOString()
  };
}
