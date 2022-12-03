// translate router.meta.title, be used in breadcrumb sidebar tagsview
import { useI18n } from "vue-i18n";

export function generateRouteTitle(title) {
  const { t,te } = useI18n({
    useScope: "global",
  });
  const hasKey = te('route.' + title)

  if (hasKey) {
    // $t :this method from vue-i18n, inject in @/lang/index.js
    const translatedTitle = t('route.' + title)

    return translatedTitle
  }
  return title
}
