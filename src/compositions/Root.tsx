import React from 'react'
import { Composition } from 'remotion'
import { VideoProject } from './VideoProject'

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="VideoProject"
        component={VideoProject as React.FC}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          scenes: [],
          captions: [],
          voiceoverUrl: null,
          cta: null,
        }}
      />
    </>
  )
}
