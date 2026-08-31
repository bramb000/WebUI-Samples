<script setup lang="ts">
import { ref } from 'vue';
import ProjectHero from '../components/ProjectHero.vue';
import CaseImage from '../components/CaseImage.vue';
import CaseInsight from '../components/CaseInsight.vue';
import PlanoversePipelineChart from '../components/planoverse/PlanoversePipelineChart.vue';
import PlanoverseMatchingUml from '../components/planoverse/PlanoverseMatchingUml.vue';
import CaseStudySummary from '../components/case-study/CaseStudySummary.vue';
import CaseStudyPasswordGate from '../components/case-study/CaseStudyPasswordGate.vue';
import TableOfContents from '../components/TableOfContents.vue';
import { planoverseSummary } from '../constants/caseStudySummaries/planoverseSummary';
import { useCaseStudySketchPanels } from '../composables/useCaseStudySketchPanels';

import macroStoreMap from '../assets/images/planoverse/macro-store-map.png';
import macroStoreMapBay from '../assets/images/planoverse/macro-store-map-bay-select.png';
import bayComparisonCanned from '../assets/images/planoverse/bay-comparison-canned-overview.png';
import categoryNaming from '../assets/images/planoverse/category-naming-tooltip.png';
import bayComparisonProducts from '../assets/images/planoverse/bay-comparison-products.png';
import bayShareMethodology from '../assets/images/planoverse/bay-share-methodology.png';
import categorySubcategorySplit from '../assets/images/planoverse/category-subcategory-split.png';
import shareOfStoreTooltip from '../assets/images/planoverse/share-of-store-tooltip.png';
import shareOfStoreChart from '../assets/images/planoverse/share-of-store-chart.png';
import subcategoriesTable from '../assets/images/planoverse/subcategories-table.png';
import bayComparisonPasta from '../assets/images/planoverse/bay-comparison-pasta.png';
import colesAisleStock from '../assets/images/planoverse/coles-aisle-stock.jpg';
import woolworthsAisleStock from '../assets/images/planoverse/woolworths-aisle-stock.jpg';

const caseStudyRoot = ref<HTMLElement | null>(null);
useCaseStudySketchPanels(caseStudyRoot);
</script>

<template>
  <div ref="caseStudyRoot" class="animate-fade-in case-study-page relative">
    <div class="case-study-layout">
      <div class="case-study-main">

        <ProjectHero
          title="B2B competitive intelligence for retail companies"
          description="An 8-week Planoverse pilot that turned Woolworths and Coles in-store mobile APIs into daily shelf intelligence for category managers."
          role="Product Builder"
          timeline="8 weeks"
          :tags="['B2B SaaS', 'Data Pipeline', 'Retail Analytics', 'Product Matching']"
        >
          <template #team>
            <p class="type-case-team">2</p>
          </template>
        </ProjectHero>

        <CaseStudySummary :summary="planoverseSummary" />

        <CaseStudyPasswordGate>

        <section class="case-study-section">
          <h2 class="type-case-section">Context</h2>
          <div class="case-study-section__content">
            <p class="type-case-lead">
              Category managers at large grocers allocate capital, range, and promo spend from one question: <strong>what are competitors doing this week?</strong> That answer drives which SKUs stay on shelf, which suburbs get which offers, and whether shoppers leave thinking your store is the expensive one.
            </p>
            <p class="type-case-body-lg">
              Retailers pay heavily for that signal. The usual method is still a person walking a rival store once or twice a year, scribbling notes on facings and end caps. Photos are risky. You can get escorted out. The output is anecdotal, not comparable week to week.
            </p>
            <p class="type-case-body-lg">
              At Planoverse I built a demo and pilot for Woolworths that replaced those visits with structured daily data: price, stock, aisle, bay, and coordinates pulled from the same in-store flows shoppers already use on mobile.
            </p>
          </div>
        </section>

        <section class="case-study-section">
          <h2 class="type-case-section">The data problem</h2>
          <p class="type-case-lead">
            Competitive intelligence in grocery has no shared schema. Every banner names categories differently, uses different barcodes for the same pack size, and hides layout detail outside the apps built for shoppers.
          </p>
          <div class="case-insight-grid case-insight-grid--cols-3 case-study-margin-top--3">
            <CaseInsight stat="1–2×" statLabel="Store visits per year" theme="after">
              <p class="type-case-body">The best manual programs still sample a handful of locations. Promo matching stays lagged by months.</p>
            </CaseInsight>
            <CaseInsight stat="No photos" statLabel="Field risk" theme="after">
              <p class="type-case-body">Teams want evidence. Stores do not want cameras in every aisle.</p>
            </CaseInsight>
            <CaseInsight stat="Millions" statLabel="Budget at stake" theme="after">
              <p class="type-case-body">Range and price perception decisions run on incomplete competitor pictures.</p>
            </CaseInsight>
          </div>
        </section>

        <section class="case-study-section">
          <h2 class="type-case-section">Approach</h2>
          <div class="case-study-section__content type-case-body-lg">
            <p class="type-case-lead">
              Woolworths and Coles already publish in-store assortment inside their mobile apps: search, stock status, and pathfinding to a product on the floor. That data does not appear on the public website in a form category teams can subscribe to.
            </p>
            <p>
              I built a daily collection process that reads those apps like a shopper, stores the raw results, matches equivalent products across banners, and publishes shelf intelligence to the Planoverse dashboard. Category managers never touch the source systems — they get refreshed charts and store maps each morning.
            </p>
          </div>

          <h3 class="type-case-subsection case-study-margin-top--4">From app to dashboard</h3>
          <PlanoversePipelineChart />

          <h3 class="type-case-subsection type-case-subsection--offset">Cross-banner product matching</h3>
          <p class="type-case-body-lg">
            The two banners use different product names, barcodes, and category trees for the same item on shelf. Matching happens bottom up: pair SKUs first, then derive shared categories from those pairs.
          </p>
          <PlanoverseMatchingUml />
        </section>

        <section class="case-study-section">
          <h2 class="type-case-section">Pilot deliverables</h2>

          <h3 class="type-case-subsection">Share of store</h3>
          <p class="type-case-body-lg">
            Woolworths executives asked one question first: how does shelf space in our store compare to the Coles down the road? I built a butterfly chart of bay-equivalent share by subcategory, store by store.
          </p>
          <CaseImage
            :src="shareOfStoreChart"
            alt="Share of store bays chart comparing Coles and Woolworths subcategories at Ashfield"
            caption="Bay-equivalent share at Ashfield. Mixed bays split by product mix, not winner-take-all."
          />
          <CaseImage
            :src="shareOfStoreTooltip"
            alt="Tooltip explaining how share of store bays is calculated"
            caption="Executives self-served once the metric was explained inline."
          />

          <h3 class="type-case-subsection type-case-subsection--offset">Category standardisation</h3>
          <p class="type-case-body-lg">
            Woolworths "Pantry" splinters across Pantry, Chips and Chocolate, Dietary, and World Foods on Coles. Stakeholders needed two-way mapping built bottom up: match products first, derive shared categories second.
          </p>
          <CaseImage
            :src="categoryNaming"
            alt="Card explaining shared, Coles, and Woolworths category labels"
            caption="Shared label in the middle; each banner keeps its own vocabulary."
          />
          <CaseImage
            :src="subcategoriesTable"
            alt="Table of subcategories with bay share, promo rate, and product counts"
            caption="Ashfield subcategories with bay share, on-special %, and range depth."
          />
          <CaseImage
            :src="categorySubcategorySplit"
            alt="Side-by-side bay comparison showing different subcategory splits for pasta"
            caption="Same aisle topic, different internal taxonomy splits on each banner."
          />

          <h3 class="type-case-subsection type-case-subsection--offset">Methodology transparency</h3>
          <p class="type-case-body-lg">
            Executives would not trust cross-banner numbers unless the math was visible. Inline explanations for bay share, adjacency, and mapping rules let category leaders self-serve without a customer success rep in the room.
          </p>
          <CaseImage
            :src="bayShareMethodology"
            alt="Tooltip describing fractional bay share calculation"
            caption="Fractional bays when a shelf section carries more than one category."
          />
          <CaseImage
            :src="bayComparisonProducts"
            alt="Bay comparison with product lists for Coles and Woolworths"
            caption="Drill-down from chart row to SKU lists and adjacency touch counts."
          />

          <h3 class="type-case-subsection type-case-subsection--offset">Macro store intelligence</h3>
          <p class="type-case-body-lg">
            Macro layout is which categories sit beside each other on the floor. That placement drives basket size: bread next to honey on promo pulls incremental spend. Every store team wants the competitor map, not a spreadsheet of SKUs.
          </p>
          <p class="type-case-body-lg">
            I built an interactive floor plan per banner: pan, zoom, tap a bay, compare product to product or category to category, then export a standardised view for leadership reviews.
          </p>
          <CaseImage
            :src="macroStoreMap"
            alt="Coles and Woolworths store maps side by side with bay counts"
            caption="Store footprint comparison across banners at the same suburb."
          />
          <CaseImage
            :src="macroStoreMapBay"
            alt="Woolworths map with pasta bay selected"
            caption="Bay-level drill-in: tap a section to compare SKU range and adjacency."
          />
          <CaseImage
            :src="bayComparisonCanned"
            alt="Bay comparison overview for canned food and instant meals"
            caption="Matching bays across banners with footprint % and adjacency."
          />
          <CaseImage
            :src="bayComparisonPasta"
            alt="Bay comparison for pasta with annotated stakeholder feedback"
            caption="Stakeholders annotated views directly once explanations were embedded."
          />
        </section>

        <section class="case-study-section">
          <h2 class="type-case-section">Field verification</h2>
          <p class="type-case-lead">
            Dashboards are easy to distrust when the numbers come from someone else's pipeline. We printed the aisle and bay outputs and walked our local Coles and Woolworths with the sheets in hand.
          </p>
          <p class="type-case-body-lg">
            Bay labels, adjacency, and category splits matched what we saw on the floor. A few edge cases were off — mostly Coles bays where map pins had not resolved to a bay number yet — but the macro layout and share-of-store rankings held up. That visit is what got category managers comfortable signing off on the pilot.
          </p>
          <div class="case-study-media-grid case-study-margin-top--4">
            <CaseImage
              :src="colesAisleStock"
              alt="Coles supermarket aisle with stocked shelves"
              caption="Coles — South City, aisle view used as a floor reference."
            />
            <CaseImage
              :src="woolworthsAisleStock"
              alt="Woolworths supermarket frozen aisle with product facings"
              caption="Woolworths — Alexandria frozen section, same walk-through."
            />
          </div>
        </section>

        <section class="case-study-section">
          <h2 class="type-case-section">Result</h2>
          <p class="type-case-lead">
            The Woolworths pilot converted to a contract. Category leaders said they had not seen competitor shelf data at this granularity before: daily refresh, bay-level coordinates, and explicit mapping between banner taxonomies.
          </p>
        </section>

        <section class="case-study-section">
          <h2 class="type-case-section">Learnings</h2>
          <p class="type-case-body-lg">
            Data without process transparency does not get used. The hard part was explaining how pairs, bay fractions, and category crosswalks worked without publishing the parts of the scrape stack we treat as trade secrets. Documented methodology carried more weight than another dashboard tile.
          </p>
        </section>

        </CaseStudyPasswordGate>

      </div>

      <div class="toc-sidebar-column">
        <div class="toc-sidebar-sticky">
          <TableOfContents />
        </div>
      </div>
    </div>
  </div>
</template>
