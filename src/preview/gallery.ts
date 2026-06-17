import { moments as momentAssets, proofImages } from '../content'
import type { SiteContent } from '../i18n'
import { editorialAssets, spaceAssets } from '../data/siteData'
import type { PreviewImage } from './types'

export function getPreviewGallery(content: SiteContent): PreviewImage[] {
  const rawPreviewGallery: PreviewImage[] = [
    ...content.moments.map((moment, index) => {
      const asset = momentAssets[index]

      return {
        src: asset.image,
        alt: moment.alt,
        title: moment.kicker,
        detail: moment.title,
        width: asset.width,
        height: asset.height,
      }
    }),
    ...proofImages.map((image, index) => ({
      src: image.src,
      alt: image.alt,
      title: content.menu.proofCaptions[index],
      detail: image.alt,
      width: image.width,
      height: image.height,
    })),
    ...editorialAssets.map((asset, index) => {
      const item = content.editorialAssets[index]

      return {
        src: asset.image,
        alt: asset.alt,
        title: item.label,
        detail: item.title,
        width: asset.width,
        height: asset.height,
      }
    }),
    ...content.spaces.map((space, index) => {
      const asset = spaceAssets[index]

      return {
        src: asset.image,
        alt: asset.alt,
        title: content.preview.spaceTitle,
        detail: space.title,
        width: asset.width,
        height: asset.height,
      }
    }),
  ]

  return rawPreviewGallery.filter(
    (item, index, gallery) => gallery.findIndex((candidate) => candidate.src === item.src) === index,
  )
}
