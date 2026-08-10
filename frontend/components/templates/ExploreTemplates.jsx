import ExploreCard from "./ExploreCard";

export default function ExploreTemplates() {
  return (
    <section className="w-full bg-[#FAF9F7] pb-12">
      <div className="max-w-[1280px] mx-auto px-8">

        

        <div className="flex items-center justify-between">

          <h2 className="text-[32px] font-medium text-[#111111]">
            Explore templates
          </h2>

        

        </div>

        

        <div className="mt-8 grid grid-cols-5 gap-5">

          <ExploreCard
            title="Father's Day"
            image="/images/fathert.svg"
          />

          <ExploreCard
            title="Mother's Day"
            image="/images/mothert.svg"
          />

          <ExploreCard
            title="Wedding"
            image="/images/weddingt.svg"
          />

          <ExploreCard
            title="Birthday"
            image="/images/birthday.svg"
          />

          <ExploreCard
            title="Travel"
            image="/images/travelt.svg"
          />

          <ExploreCard
            title="Anniversary"
            image="/images/couplet.svg"
          />

          <ExploreCard
            title="Instagram Story"
            image="/images/familyt.svg"
          />

          <ExploreCard
            title="Pregnancy Shoot"
            image="/images/pragt.svg"
          />

          <ExploreCard
            title="Kids / Childhood Memories"
            image="/images/babyt.svg"
          />

          <ExploreCard
            title="Festivals"
            image="/images/festt.svg"
          />

        </div>

      </div>
    </section>
  );
}