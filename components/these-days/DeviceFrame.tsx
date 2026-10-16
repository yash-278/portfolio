import Image, { type StaticImageData } from 'next/image'
import styles from './DeviceFrame.module.css'

type DeviceFrameProps = {
  src: StaticImageData
  alt: string
  sizes: string
  className?: string
  preload?: boolean
}

export default function DeviceFrame({ src, alt, sizes, className = '', preload = false }: DeviceFrameProps) {
  return (
    <div className={`${styles.device} ${className}`}>
      <span className={styles.buttons} aria-hidden="true" />
      <div className={styles.screen}>
        <Image src={src} alt={alt} sizes={sizes} preload={preload} />
        <span className={styles.island} aria-hidden="true" />
      </div>
    </div>
  )
}
