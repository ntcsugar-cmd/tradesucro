import type { MillOffer, MillOfferDraft } from "@/lib/types/millOffer";

/** Strips the server-assigned fields (id, offerNumber, status, audit fields) off a MillOffer, leaving the editable Draft shape. */
export function toMillOfferDraft(offer: MillOffer): MillOfferDraft {
  const {
    id: _id,
    offerNumber: _offerNumber,
    status: _status,
    createdBy: _createdBy,
    createdAt: _createdAt,
    updatedAt: _updatedAt,
    ...draft
  } = offer;
  return draft;
}
