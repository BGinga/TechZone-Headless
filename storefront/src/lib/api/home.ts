// src/lib/api/home.ts
import { shopifyFetch } from "@/lib/shopifyFetch";

type Slide = {
  id: string;
  title: string;
  url: string | null;
  action: string | null;
  image?: { url: string; altText?: string | null } | null;
  imageResponsive?: { url: string; altText?: string | null } | null;
};

type MetaobjectField =
  | { key: string; value: string | null }
  | {
      key: string;
      reference?: {
        __typename?: string;
        // MediaImage case
        image?: { url: string; altText?: string | null } | null;
      } | null;
    };

type MetaobjectNode = {
  id: string;
  fields: MetaobjectField[];
};

type HomeSlidesResponse = {
  metaobjects: {
    edges: { node: MetaobjectNode }[];
  };
};

// Type guards for metaobject fields
function isValueField(
  f: MetaobjectField | undefined
): f is { key: string; value: string | null } {
  return !!f && "value" in f;
}
function isReferenceField(f: MetaobjectField | undefined): f is {
  key: string;
  reference?: {
    __typename?: string;
    image?: { url: string; altText?: string | null } | null;
  } | null;
} {
  return !!f && "reference" in f;
}

const GQL = /* GraphQL */ `
  query HomeSlides {
    metaobjects(first: 20, type: "homeslides") {
      edges {
        node {
          id
          fields {
            key
            value
            reference {
              __typename
              ... on MediaImage {
                image {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function getHomeSlides(): Promise<Slide[]> {
  const data = await shopifyFetch<HomeSlidesResponse>(GQL);
  const edges = data?.metaobjects?.edges ?? [];
  const slides: Slide[] = edges.map(({ node }) => {
    // map fields by key (case-insensitive por si acaso)
    const get = (k: string): MetaobjectField | undefined =>
      node.fields.find(
        (f: MetaobjectField) => (f.key || "").toLowerCase() === k.toLowerCase()
      );

    const titleField = get("Title");
    const urlField = get("Url");
    const actionField = get("Action");
    const imageField = get("Image");
    const responsiveField = get("Responsive");

    const title = isValueField(titleField) ? titleField.value ?? "" : "";
    const url = isValueField(urlField) ? urlField.value ?? null : null;
    const action = isValueField(actionField) ? actionField.value ?? null : null;

    const imageRef = isReferenceField(imageField)
      ? imageField.reference
      : undefined;
    const imageResponsiveRef = isReferenceField(responsiveField)
      ? responsiveField.reference
      : undefined;

    const image =
      imageRef?.__typename === "MediaImage"
        ? {
            url: imageRef.image?.url as string,
            altText: imageRef.image?.altText ?? title,
          }
        : null;

    const imageResponsive =
      imageResponsiveRef?.__typename === "MediaImage"
        ? {
            url: imageResponsiveRef.image?.url as string,
            altText: imageResponsiveRef.image?.altText ?? title,
          }
        : null;

    return {
      id: node.id,
      title,
      url,
      action,
      image,
      imageResponsive,
    };
  });

  // Ordena por fecha de creación si quieres; aquí lo dejamos en el orden de Shopify
  return slides;
}
