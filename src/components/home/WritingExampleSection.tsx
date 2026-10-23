export default function WritingExampleSection() {
  return (
    <section aria-labelledby="writing-example-heading" className="bg-[hsl(var(--surface-warm))] py-12 md:py-16">
      <div className="section-container grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">The difference is in the detail</p>
          <h2 id="writing-example-heading" className="heading-section">Show what you do. Make it specific.</h2>
          <p className="mt-5 text-base leading-7 text-muted-foreground">A useful CV turns broad responsibilities into clear descriptions of your work, tools and contribution.</p>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">Illustrative writing example, not a client result. Every detail in your CV should reflect your actual experience.</p>
        </div>
        <div className="overflow-hidden rounded-[var(--radius-bento)] border border-primary/20 bg-card">
          <div className="border-b border-border p-6 sm:p-8">
            <h3 className="text-sm font-semibold text-muted-foreground">Before · a general responsibility</h3>
            <p className="mt-3 text-lg leading-8">“Responsible for stock and reports.”</p>
          </div>
          <div className="bg-[hsl(var(--surface-teal-soft))] p-6 sm:p-8">
            <h3 className="text-sm font-semibold text-primary">After · a clearer description</h3>
            <p className="mt-3 text-lg font-medium leading-8">“Maintained stock records in Excel, reconciled weekly counts and prepared replenishment reports for the purchasing team.”</p>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">Names the tool, the task and who used the work. Add measurable results only when you can substantiate them.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
