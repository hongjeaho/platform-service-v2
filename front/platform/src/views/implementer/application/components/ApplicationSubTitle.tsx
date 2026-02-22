import { PageSubTitle } from '@/common/components/ui'
import { buttonVariants } from '@/constants/design/color'
import { icons, iconSizes } from '@/constants/design/icons'
import { borderRadius, padding } from '@/constants/design/spacing'
import { textCombinations } from '@/constants/design/typography'
import { cn } from '@/lib/utils'

import styles from './ApplicationSubTitle.module.css'

const DownloadIcon = icons.download

export default function ApplicationSubTitle() {
  return (
    <PageSubTitle title='LTIS입력정보확인'>
      <a
        href='/files/Reconsideration_Support_System_Project_Implementer_Manual.pdf'
        download
        className={cn(
          buttonVariants.outline,
          padding.buttonSm,
          borderRadius.md,
          textCombinations.buttonSm,
          styles.downloadLink,
        )}
      >
        <DownloadIcon className={cn(iconSizes.sm)} aria-hidden='true' />
        사용설명서
      </a>
      <a
        href='/files/2.Implementer_Write_Guide.mp4'
        download
        className={cn(
          buttonVariants.outline,
          padding.buttonSm,
          borderRadius.md,
          textCombinations.buttonSm,
          styles.downloadLink,
        )}
      >
        <DownloadIcon className={cn(iconSizes.sm)} aria-hidden='true' />
        동영상 설명서
      </a>
    </PageSubTitle>
  )
}
