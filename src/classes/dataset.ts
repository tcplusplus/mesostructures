interface Images {
  main: string,
  reverse: string,
}

class DirectionDataset {
  private level: number

  public levels: Images[] = []

  constructor(level: number) {
    this.level = level;
    for (let i = 0; i < level; ++i) {
      this.levels[i] = { main: '', reverse: '' };
    }
  }
}

export class Dataset {
  horizontal: DirectionDataset

  vertical: DirectionDataset

  numLevels: number

  constructor(levels: number) {
    this.numLevels = levels;
    this.horizontal = new DirectionDataset(levels);
    this.vertical = new DirectionDataset(levels);
  }

  static loadTestSet() {
    const dataset = new Dataset(3);
    dataset.horizontal.levels[0] = {
      main: require('@/assets/recording/horizontal/1.png'),
      reverse: require('@/assets/recording/horizontal/1rev.png'),
    };
    dataset.horizontal.levels[1] = {
      main: require('@/assets/recording/horizontal/2.png'),
      reverse: require('@/assets/recording/horizontal/2rev.png'),
    };
    dataset.horizontal.levels[2] = {
      main: require('@/assets/recording/horizontal/3.png'),
      reverse: require('@/assets/recording/horizontal/3rev.png'),
    };
    return dataset;
  }
}
