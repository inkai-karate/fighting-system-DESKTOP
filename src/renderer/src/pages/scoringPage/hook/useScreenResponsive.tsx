import { useEffect, useMemo, useState } from 'react'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useScreenResponsive = () => {
  const [screenSize, setScreenSize] = useState({ width: 1920, height: 1080 })

  useEffect(() => {
    let mounted = true

    const fetchSize = async (attempts = 4, delay = 50): Promise<void> => {
      try {
        const size = await window.api?.screen?.getSize()
        if (mounted && size && size.width && size.height) {
          setScreenSize(size)
          return
        }
      } catch (e) {
        console.log('fetchSize: ', e)
      }

      if (attempts > 0) setTimeout(() => fetchSize(attempts - 1, delay * 2), delay)
      else if (mounted) setScreenSize({ width: window.innerWidth, height: window.innerHeight })
    }

    fetchSize()

    if (window.api?.screen?.onSizeChanged) {
      window.api.screen.onSizeChanged((size) => {
        if (mounted && size && size.width && size.height) setScreenSize(size)
      })
    }

    const onWinResize = (): void => {
      if (!mounted) return
      setScreenSize({ width: window.innerWidth, height: window.innerHeight })
    }

    window.addEventListener('resize', onWinResize)

    return () => {
      mounted = false
      window.removeEventListener('resize', onWinResize)
    }
  }, [])

  const sizes1 = useMemo(() => {
    const h = screenSize.height
    return {
      headerHeight: h * 0.055 * 1.365,
      startButtonHeight: h * 0.07 * 1.365,
      timerButtonHeight: h * 0.045 * 1.365,
      scoreButtonHeight: h * 0.055 * 1.365,
      penaltyButtonHeight: h * 0.048 * 1.365,
      checkboxSize: h * 0.025 * 1.365,
      selectHeight: h * 0.045 * 1.365,
      roundButtonHeight: h * 0.045 * 1.365,
      resetButtonHeight: h * 0.055 * 1.365,

      containerPadding: h * 0.012,
      sectionGap: h * 0.012,
      gridGap: h * 0.006,

      headerFont: h * 0.022 * 1.25,
      sectionTitleFont: h * 0.016 * 1.25,
      buttonTextFont: h * 0.014 * 1.25,
      smallTextFont: h * 0.013 * 1.25,
      tinyTextFont: h * 0.011 * 1.25,

      displayLogoHeight: h * 0.12 * 1.03 * 1.03,
      displayScoreHeight: h * 0.35 * 1.03 * 1.03,
      displayWarningHeight: h * 0.15 * 1.03 * 1.03,
      displayRoundHeight: h * 0.08 * 1.03 * 1.03,

      logoFont: h * 0.028,
      timerFont: h * 0.1,
      timerDecimalFont: h * 0.05,
      scoreFont: h * 0.12,
      scoreLabelFont: h * 0.038,
      warningFont: h * 0.018,
      warningLabelFont: h * 0.015,
      roundFont: h * 0.026,

      iconSmall: h * 0.02,
      iconMedium: h * 0.026,
      iconLarge: h * 0.032
    }
  }, [screenSize])

  const sizes2 = useMemo(() => {
    const h = screenSize.height
    return {
      headerHeight: h * 0.055 * 2.2,
      startButtonHeight: h * 0.07 * 2.2,
      timerButtonHeight: h * 0.055 * 1,
      scoreButtonHeight: h * 0.055 * 2.2,
      penaltyButtonHeight: h * 0.048 * 2.2,
      checkboxSize: h * 0.025 * 2.2,
      selectHeight: h * 0.045 * 1,
      roundButtonHeight: h * 0.045 * 1,
      resetButtonHeight: h * 0.055 * 1,

      containerPadding: h * 0.012,
      sectionGap: h * 0.012,
      gridGap: h * 0.006,

      headerFont: h * 0.022 * 1.25,
      sectionTitleFont: h * 0.016 * 1.25,
      buttonTextFont: h * 0.014 * 1.25,
      smallTextFont: h * 0.013 * 1.25,
      tinyTextFont: h * 0.011 * 1.25,

      displayLogoHeight: h * 0.12 * 1.03 * 1.03,
      displayScoreHeight: h * 0.35 * 1.03 * 1.03,
      displayWarningHeight: h * 0.15 * 1.03 * 1.03,
      displayRoundHeight: h * 0.08 * 1.03 * 1.03,

      logoFont: h * 0.028,
      timerFont: h * 0.1,
      timerDecimalFont: h * 0.05,
      scoreFont: h * 0.12,
      scoreLabelFont: h * 0.038,
      warningFont: h * 0.018,
      warningLabelFont: h * 0.015,
      roundFont: h * 0.026,

      iconSmall: h * 0.02,
      iconMedium: h * 0.026,
      iconLarge: h * 0.032
    }
  }, [screenSize])

  return { screenSize, sizes1, sizes2 }
}
