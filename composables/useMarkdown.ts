import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { QueryBuilderWhere } from '@nuxt/content/dist/runtime/types';
import type { Document } from '~/types';

export interface Options {
  localized?: boolean;
  where?: QueryBuilderWhere;
  limit?: number;
  first?: boolean;
  allowFailed?: boolean;
}

const options = {
  localized: true,
  first: false,
  allowFailed: true,
};

export async function useMarkdown(path: string, opts?: Options) {
  const documents = ref<Document[]>([]);

  const { locale, defaultLocale } = useI18n();

  async function fetchContent(options: Options): Promise<Document[]> {
    const localizedPath = `${locale.value}/${path}`;
    console.log('items:', localizedPath)
    let d = queryContent<Document>(path);
    if (options.where)
      d = d.where(options.where);

    if (options.limit)
      d = d.limit(options.limit);

    if (options.first)
      d = d.limit(1);
    d = d.locale(locale.value)
    try {
      console.log('items:', d.find())
      return await d.find();

    } catch (error) {
      if (!options.allowFailed) throw error;
      console.error('Error fetching content:', error);
      return [];
    }
  }

  const items = await fetchContent(options);
  console.log('items:', items)

  items.forEach((item) => {
    let slug = item._file?.replace(/\.md$/, '') || '';
    slug = slug.split('/').pop() || '';

    const l = locale.value;
    const defaultL = defaultLocale || 'de';

    const fallback = item._path?.split('/') || [];
    fallback.shift();
    let fallbackPath = `/${fallback.join('/')}`;
    if (l !== defaultL)
      fallbackPath = `/${l}${fallbackPath}`;

    const link = `${fallbackPath}`;
    documents.value.push({
      ...item,
      _link: link,
      _slug: slug,
    });
  });

  return {
    document: documents.value.length > 0 ? documents.value[0] : undefined,
    documents,
  };
}
