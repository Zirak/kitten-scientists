import { isNil, Maybe } from "../tools/Maybe";
import { ResetBonfireSettings } from "./ResetBonfireSettings";
import { ResetReligionSettings } from "./ResetReligionSettings";
import { ResetResourcesSettings } from "./ResetResourcesSettings";
import { ResetSpaceSettings } from "./ResetSpaceSettings";
import { ResetTimeSettings } from "./ResetTimeSettings";
import { Setting } from "./Settings";

export class ResetSettings extends Setting {
  bonfire: ResetBonfireSettings;
  religion: ResetReligionSettings;
  resources: ResetResourcesSettings;
  space: ResetSpaceSettings;
  time: ResetTimeSettings;

  constructor(
    enabled = false,
    bonfire = new ResetBonfireSettings(),
    religion = new ResetReligionSettings(),
    resources = new ResetResourcesSettings(),
    space = new ResetSpaceSettings(),
    time = new ResetTimeSettings()
  ) {
    super(enabled);
    this.bonfire = bonfire;
    this.religion = religion;
    this.resources = resources;
    this.space = space;
    this.time = time;
  }

  load(settings: Maybe<Partial<ResetSettings>>) {
    if (isNil(settings)) {
      return;
    }

    super.load(settings);

    this.bonfire.load(settings.bonfire);
    this.religion.load(settings.religion);
    this.resources.load(settings.resources);
    this.space.load(settings.space);
    this.time.load(settings.time);
  }
}
