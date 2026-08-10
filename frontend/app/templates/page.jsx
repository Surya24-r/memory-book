import ExploreTemplates from "@/components/templates/ExploreTemplates";
import TemplatesHero from "@/components/templates/TemplatesHero";
import TrendingTemplates from "@/components/templates/TrendingTemplates";
import MoreTemplates from "@/components/templates/MoreTemplates";

export default function TemplatesPage(){
    return(
        <>
            <TemplatesHero/>
            <ExploreTemplates/>
            <TrendingTemplates/>
            <MoreTemplates/>
        </>
    )
}