import { useMemo, useState, type FormEvent } from "react";
import SectionHeading from "../components/SectionHeading";
import Card from "../components/Card";
import StarRating from "../components/StarRating";
import { seededTestimonials, type Testimonial } from "../data/testimonials";
import { getStoredTestimonials, saveTestimonial } from "../services/testimonialsStore";

/** Testimonials list with average rating summary and a submission form. */
export default function Testimonials() {
  const [userTestimonials, setUserTestimonials] = useState<Testimonial[]>(
    () => getStoredTestimonials()
  );
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [formError, setFormError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // User-submitted entries appear first, then the seeded samples
  const all = useMemo(
    () => [...userTestimonials, ...seededTestimonials],
    [userTestimonials]
  );

  const average = useMemo(
    () => all.reduce((sum, t) => sum + t.rating, 0) / all.length,
    [all]
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError("Please enter your name.");
      return;
    }
    if (rating < 1) {
      setFormError("Please select a star rating.");
      return;
    }
    if (!comment.trim()) {
      setFormError("Please write a short comment.");
      return;
    }
    const saved = saveTestimonial({ name: name.trim(), rating, comment: comment.trim() });
    setUserTestimonials((prev) => [saved, ...prev]);
    setName("");
    setRating(0);
    setComment("");
    setFormError("");
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <SectionHeading
        title="Testimonials & Ratings"
        subtitle="What clients say about their consultations — and a place to share your own experience."
      />

      {/* Average rating summary */}
      <div className="mb-10 flex flex-col items-center gap-2 rounded-2xl border border-gray-300 bg-white p-6 text-center shadow-md">
        <p className="font-display text-5xl text-gray-900">{average.toFixed(1)}</p>
        <StarRating value={average} size={26} />
        <p className="text-sm text-gray-500">
          Average from {all.length} review{all.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Submission form */}
      <Card className="mb-10">
        <h2 className="font-display text-xl text-gray-900">Share Your Experience</h2>
        <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-4">
          <div>
            <label htmlFor="t-name" className="mb-1 block text-sm text-gray-600">
              Your name <span className="text-rose-600">*</span>
            </label>
            <input
              id="t-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Kavya R."
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
          </div>

          <div>
            <p className="mb-1 text-sm text-gray-600">
              Your rating <span className="text-rose-600">*</span>
            </p>
            <StarRating value={rating} onChange={setRating} size={28} />
          </div>

          <div>
            <label htmlFor="t-comment" className="mb-1 block text-sm text-gray-600">
              Your comment <span className="text-rose-600">*</span>
            </label>
            <textarea
              id="t-comment"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How was your consultation?"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
          </div>

          {formError && (
            <p className="text-sm text-rose-600" role="alert">
              {formError}
            </p>
          )}
          {submitted && !formError && (
            <p className="text-sm text-emerald-600" role="status">
              🙏 Thank you! Your testimonial has been added below.
            </p>
          )}

          <button
            type="submit"
            className="rounded-full bg-gray-900 px-6 py-2.5 font-semibold text-white transition hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
          >
            Submit Testimonial
          </button>
          <p className="text-xs text-gray-400">
            Stored only in your browser (demo site — no server).
          </p>
        </form>
      </Card>

      {/* Testimonial list */}
      <ul className="space-y-5">
        {all.map((t) => (
          <li key={t.id}>
            <Card>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-gray-900">{t.name}</p>
                <div className="flex items-center gap-3">
                  <StarRating value={t.rating} size={18} />
                  <time dateTime={t.date} className="text-xs text-gray-400">
                    {t.date}
                  </time>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{t.comment}</p>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
