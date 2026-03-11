# CMX1 Activity Studio — Numeric Question Type

> **Parent:** [`cmx1/form-building/shared-concepts.md`](../shared-concepts.md)

The Numeric question type accepts a numeric input from the end-user. Useful for measurements, counts, temperatures, and other quantitative data.

For universal concepts (answer table, evaluation settings, observations, recommendations, logic rules, footer controls), see **[shared-concepts.md](../shared-concepts.md)**.

---

> **IMPORTANT:** Numeric and Temperature share the same **condition-based evaluation grid** (`numeric-type-grid-*` selectors). For comprehensive documentation of the condition grid system, operators, compliance settings, and automation workflows, see **[temperature-timer.md](./temperature-timer.md)**.
>
> The primary difference is the answer config data-cy attributes:
> - Numeric: `[data-cy="answer-config-numeric"]` / `[data-cy="answer-config-detail-content-numeric"]`
> - Temperature: `[data-cy="answer-config-temperature"]` / `[data-cy="answer-config-detail-content-temperature"]`

> **TODO:** This question type has not yet been independently explored in the UI. Future sessions should document:
> - Numeric block layout differences from Temperature (no thermometer icon, custom units)
> - Numeric-specific Answer sub-panel settings (Controls, Allowed Inputs, Unit of Measurement, Field Labels, Decimals, Calculation Type)
> - Any Numeric-specific operators or condition settings not present in Temperature
> - Example configurations (e.g., count limits, measurement ranges)
> - Automation workflows specific to Numeric
