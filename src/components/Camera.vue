<template>
  <div id="camera-container">
    <video autoplay ref="video" id="video" playsinline>
      <track kind="captions" />
    </video>

    <div id="slot-container">
      <slot></slot>
    </div>
  </div>

  <canvas ref="canvas" id="canvas"></canvas>
</template>

<script lang="ts">
import {
  defineComponent, onMounted, onUnmounted, PropType, ref,
} from 'vue';
import { MediaDeviceKind } from '../classes/media-device-kind';
import { Resolution } from '../classes/resolution';

export default defineComponent({
  name: 'CameraConnection',
  components: {},
  emits: [
    'loading',
    'started',
    'stopped',
    'paused',
    'resumed',
    'camera-change',
    'snapshot',
    'error',
  ],
  props: {
    resolution: {
      type: Object as PropType<Resolution>,
      default: () => ({ width: 1920, height: 1080 }),
    },
    facingMode: {
      type: String,
      default: 'environment',
    },
    autoplay: {
      type: Boolean,
      default: false,
    },
    constraints: {
      type: Object,
      required: false,
    },
  },
  setup(props, { emit }) {
    const video = ref<HTMLVideoElement>();
    const canvas = ref<HTMLCanvasElement>();
    const stream = ref<MediaStream>();

    const constraints = props.constraints || {
      video: {
        width: props.resolution.width,
        height: props.resolution.height,
        facingMode: props.facingMode,
        deviceId: {},
      },
      audio: false,
    };

    const devices = async (
      kinds: MediaDeviceKind[] = ['audioinput', 'videoinput'],
    ): Promise<MediaDeviceInfo[]> => {
      const currentDevices = await navigator.mediaDevices.enumerateDevices();
      return currentDevices.filter((device) => kinds.includes(device.kind));
    };

    const currentDeviceID = (): string | undefined => {
      if (!stream.value) return;

      const tracks = stream.value
        .getVideoTracks()
        .map((track: MediaStreamTrack) => track.getSettings().deviceId);

      // eslint-disable-next-line consistent-return
      if (tracks.length > 0) return tracks[0];
    };

    const start = async (): Promise<void> => {
      emit('loading');

      try {
        stream.value = await navigator.mediaDevices.getUserMedia(
          constraints,
        );

        if (!video.value) throw new Error('Video ref is null');

        video.value.srcObject = stream.value;

        emit('started');
      } catch (err) {
        emit('error', err);
      }
    };

    const snapshot = (
      // eslint-disable-next-line default-param-last
      resolution: Resolution = props.resolution,
      // eslint-disable-next-line default-param-last
      type = 'image/png',
      quality?: number,
    ): Promise<Blob | null> => {
      if (!video.value) throw new Error('Video ref is null');
      if (!canvas.value) throw new Error('Canvas ref is null');

      const { width, height } = resolution;

      canvas.value.width = width;
      canvas.value.height = height;

      canvas.value
        .getContext('2d')
        ?.drawImage(video.value, 0, 0, width, height);

      return new Promise((resolve) => {
        canvas.value?.toBlob(
          (blob: Blob | null) => {
            emit('snapshot', blob);
            resolve(blob);
          },
          type,
          quality,
        );
      });
    };

    const stop = (): void => {
      stream.value?.getTracks().forEach((track) => track.stop());
      emit('stopped');
    };

    const changeCamera = (deviceID: string): void => {
      stop();
      constraints.video.deviceId.exact = deviceID;
      start();
      emit('camera-change', deviceID);
    };

    const resume = (): void => {
      video.value?.play();
      emit('resumed');
    };

    const pause = (): void => {
      video.value?.pause();
      emit('paused');
    };

    onMounted(() => {
      if (!navigator.mediaDevices) throw new Error('Media devices not available');
      if (props.autoplay) start();
    });

    onUnmounted(() => stop());

    return {
      start,
      stop,
      video,
      snapshot,
      canvas,
      devices,
      currentDeviceID,
      pause,
      resume,
      changeCamera,
      stream,
    };
  },
});
</script>

<style lang="css" scoped>
#camera-container {
    position: relative;
    width: 100%;
    height: 100%;
}

#slot-container {
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
}

#video {
    width: 100%;
    height: 100%;
}

#canvas {
    display: none;
}
</style>
