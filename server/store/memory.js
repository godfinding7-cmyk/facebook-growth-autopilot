const state = {
  candidates: [],
  approved: [],
  published: []
};

export function getState() { return state; }
export function replaceCandidates(items) { state.candidates = items; }
export function approveCandidate(id) {
  const item = state.candidates.find(x => x.id === id);
  if (!item) return null;
  const approved = { ...item, status: 'approved', approvedAt: new Date().toISOString() };
  state.approved = [approved, ...state.approved.filter(x => x.id !== id)];
  return approved;
}
export function markPublished(id, metaPostId = null) {
  const item = state.approved.find(x => x.id === id) || state.candidates.find(x => x.id === id);
  if (!item) return null;
  const published = { ...item, status: 'published', metaPostId, publishedAt: new Date().toISOString() };
  state.published = [published, ...state.published.filter(x => x.id !== id)];
  return published;
}
