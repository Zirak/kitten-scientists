import { CycleIndices, TimeControlSettings } from "../options/TimeControlSettings";
import { TimeSkipSettings } from "../options/TimeSkipSettings";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { Season } from "../types";
import { UserScript } from "../UserScript";
import { SettingListItem } from "./components/SettingListItem";
import { SettingsList } from "./components/SettingsList";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem";
import { ResetBonfireSettingsUi } from "./ResetBonfireSettingsUi";
import { ResetReligionSettingsUi } from "./ResetReligionSettingsUi";
import { ResetResourcesSettingsUi } from "./ResetResourcesSettingsUi";
import { ResetSpaceSettingsUi } from "./ResetSpaceSettingsUi";
import { ResetTimeSettingsUi } from "./ResetTimeSettingsUi";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class TimeControlSettingsUi extends SettingsSectionUi {
  protected readonly _buildings: Array<SettingListItem>;
  private readonly _settings: TimeControlSettings;

  constructor(host: UserScript, settings: TimeControlSettings) {
    const label = host.engine.i18n("ui.timeCtrl");
    super(host, label, settings);

    this._settings = settings;

    this._list.addEventListener("enableAll", () => {
      this._buildings.forEach(item => (item.settings.enabled = true));
      this.refreshUi();
    });
    this._list.addEventListener("disableAll", () => {
      this._buildings.forEach(item => (item.settings.enabled = false));
      this.refreshUi();
    });
    this._list.addEventListener("reset", () => {
      this._settings.load(new TimeControlSettings());
      this.refreshUi();
    });

    this._buildings = [
      this._getOptionAccelerateTime(
        this._settings.accelerateTime,
        this._host.engine.i18n("option.accelerate")
      ),

      this._getOptionTimeSkip(this._settings.timeSkip, this._host.engine.i18n("option.time.skip")),

      this._getOptionReset(this._settings.reset, this._host.engine.i18n("option.time.reset")),
    ];

    for (const setting of this._buildings) {
      this.list.append(setting.element);
    }
  }

  private _getOptionTimeSkip(
    option: TimeControlSettings["timeSkip"],
    label: string
  ): SettingTriggerListItem {
    const element = new SettingTriggerListItem(this._host, label, option, {
      onCheck: () => this._host.engine.imessage("status.auto.enable", [label]),
      onUnCheck: () => this._host.engine.imessage("status.auto.disable", [label]),
    });

    const maximumButton = $("<div/>", {
      html: '<svg style="width: 15px; height: 15px;" viewBox="0 0 48 48"><path fill="currentColor" d="m24 36.05-2.15-2.1 8.45-8.45H4v-3h26.3l-8.4-8.45 2.1-2.1L36.05 24ZM41 36V12h3v24Z"/></svg>',
      title: this._host.engine.i18n("ui.maximum"),
    }).addClass("ks-icon-button");
    option.$maximum = maximumButton;

    maximumButton.on("click", () => {
      const value = SettingsSectionUi.promptLimit(
        this._host.engine.i18n("ui.max.set", [this._host.engine.i18n("option.time.skip")]),
        option.maximum.toFixed(0)
      );

      if (value !== null) {
        this._host.updateOptions(() => (option.maximum = value));
        maximumButton[0].title = option.maximum.toFixed(0);
      }
    });

    const cyclesButton = $("<div/>", {
      html: '<svg style="width: 15px; height: 15px;" viewBox="0 0 48 48"><path fill="currentColor" d="M9 44q-1.2 0-2.1-.9Q6 42.2 6 41V10q0-1.2.9-2.1Q7.8 7 9 7h3.25V4h3.25v3h17V4h3.25v3H39q1.2 0 2.1.9.9.9.9 2.1v15h-3v-5.5H9V41h16.2v3Zm29 4q-3.65 0-6.375-2.275T28.2 40h3.1q.65 2.2 2.475 3.6Q35.6 45 38 45q2.9 0 4.95-2.05Q45 40.9 45 38q0-2.9-2.05-4.95Q40.9 31 38 31q-1.45 0-2.7.525-1.25.525-2.2 1.475H36v3h-8v-8h3v2.85q1.35-1.3 3.15-2.075Q35.95 28 38 28q4.15 0 7.075 2.925T48 38q0 4.15-2.925 7.075T38 48ZM9 16.5h30V10H9Zm0 0V10v6.5Z"/></svg>',
      title: this._host.engine.i18n("ui.cycles"),
    }).addClass("ks-icon-button");

    const cyclesList = new SettingsList(this._host);

    for (
      let cycleIndex = 0;
      cycleIndex < this._host.gamePage.calendar.cycles.length;
      ++cycleIndex
    ) {
      cyclesList.element.append(this._getCycle(cycleIndex as CycleIndices, option));
    }

    const seasonsButton = $("<div/>", {
      html: '<svg style="width: 15px; height: 15px;" viewBox="0 0 48 48"><path fill="currentColor" d="M15.3 28.3q-.85 0-1.425-.575-.575-.575-.575-1.425 0-.85.575-1.425.575-.575 1.425-.575.85 0 1.425.575.575.575.575 1.425 0 .85-.575 1.425-.575.575-1.425.575Zm8.85 0q-.85 0-1.425-.575-.575-.575-.575-1.425 0-.85.575-1.425.575-.575 1.425-.575.85 0 1.425.575.575.575.575 1.425 0 .85-.575 1.425-.575.575-1.425.575Zm8.5 0q-.85 0-1.425-.575-.575-.575-.575-1.425 0-.85.575-1.425.575-.575 1.425-.575.85 0 1.425.575.575.575.575 1.425 0 .85-.575 1.425-.575.575-1.425.575ZM9 44q-1.2 0-2.1-.9Q6 42.2 6 41V10q0-1.2.9-2.1Q7.8 7 9 7h3.25V4h3.25v3h17V4h3.25v3H39q1.2 0 2.1.9.9.9.9 2.1v31q0 1.2-.9 2.1-.9.9-2.1.9Zm0-3h30V19.5H9V41Zm0-24.5h30V10H9Zm0 0V10v6.5Z"/></svg>',
      title: this._host.engine.i18n("trade.seasons"),
    }).addClass("ks-icon-button");

    const seasonsList = new SettingsList(this._host);

    // fill out the list with seasons
    seasonsList.element.append(this._getSeasonForTimeSkip("spring", option));
    seasonsList.element.append(this._getSeasonForTimeSkip("summer", option));
    seasonsList.element.append(this._getSeasonForTimeSkip("autumn", option));
    seasonsList.element.append(this._getSeasonForTimeSkip("winter", option));

    cyclesButton.on("click", function () {
      cyclesList.element.toggle();
      seasonsList.element.toggle(false);
    });

    seasonsButton.on("click", function () {
      cyclesList.element.toggle(false);
      seasonsList.element.toggle();
    });

    element.element.append(
      cyclesButton,
      seasonsButton,
      maximumButton,
      cyclesList.element,
      seasonsList.element
    );

    return element;
  }

  private _getOptionReset(option: TimeControlSettings["reset"], label: string): SettingListItem {
    const element = new SettingListItem(this._host, label, option, {
      onCheck: () => this._host.engine.imessage("status.auto.enable", [label]),
      onUnCheck: () => this._host.engine.imessage("status.auto.disable", [label]),
    });

    const resetBuildList = new ResetBonfireSettingsUi(this._host, this._settings.bonfireBuildings);
    const resetSpaceList = new ResetSpaceSettingsUi(this._host, this._settings.spaceItems);
    const resetResourcesList = new ResetResourcesSettingsUi(this._host, this._settings.resources);
    const resetReligionList = new ResetReligionSettingsUi(this._host, this._settings.religionItems);
    const resetTimeList = new ResetTimeSettingsUi(this._host, this._settings.timeItems);

    const buildButton = $("<div/>", {
      id: "toggle-reset-build",
      html: '<svg style="width: 15px; height: 15px;" viewBox="0 0 48 48"><path fill="currentColor" d="M4 44v-9.15L22.15 10.3 18.8 5.8l2.45-1.75L24 7.8l2.8-3.75 2.4 1.75-3.3 4.5L44 34.85V44Zm20-31.15-17 23V41h7.25L24 27.35 33.75 41H41v-5.15ZM17.95 41h12.1L24 32.5ZM24 27.35 33.75 41 24 27.35 14.25 41Z"/></svg>',
      title: this._host.engine.i18n("ui.build"),
    }).addClass("ks-icon-button");
    const spaceButton = $("<div/>", {
      id: "toggle-reset-space",
      html: '<svg style="width: 15px; height: 15px;" viewBox="0 0 48 48"><path fill="currentColor" d="m9.35 20.45 5.3 2.25q.9-1.8 1.925-3.55Q17.6 17.4 18.75 15.8L14.8 15Zm7.7 4.05 6.65 6.65q2.85-1.3 5.35-2.95 2.5-1.65 4.05-3.2 4.05-4.05 5.95-8.3 1.9-4.25 2.05-9.6-5.35.15-9.6 2.05t-8.3 5.95q-1.55 1.55-3.2 4.05-1.65 2.5-2.95 5.35Zm11.45-4.8q-1-1-1-2.475t1-2.475q1-1 2.475-1t2.475 1q1 1 1 2.475t-1 2.475q-1 1-2.475 1t-2.475-1Zm-.75 19.15 5.45-5.45-.8-3.95q-1.6 1.15-3.35 2.175T25.5 33.55Zm16.3-34.7q.45 6.8-1.7 12.4-2.15 5.6-7.1 10.55l-.1.1-.1.1 1.1 5.5q.15.75-.075 1.45-.225.7-.775 1.25l-8.55 8.6-4.25-9.9-8.5-8.5-9.9-4.25 8.6-8.55q.55-.55 1.25-.775.7-.225 1.45-.075l5.5 1.1q.05-.05.1-.075.05-.025.1-.075 4.95-4.95 10.55-7.125 5.6-2.175 12.4-1.725Zm-36.6 27.6Q9.2 30 11.725 29.975 14.25 29.95 16 31.7q1.75 1.75 1.725 4.275Q17.7 38.5 15.95 40.25q-1.3 1.3-4.025 2.15Q9.2 43.25 3.75 44q.75-5.45 1.575-8.2.825-2.75 2.125-4.05Zm2.1 2.15q-.7.75-1.25 2.35t-.95 4.1q2.5-.4 4.1-.95 1.6-.55 2.35-1.25.95-.85.975-2.125.025-1.275-.875-2.225-.95-.9-2.225-.875-1.275.025-2.125.975Z"/></svg>',
      title: this._host.engine.i18n("ui.space"),
    }).addClass("ks-icon-button");
    const resourcesButton = $("<div/>", {
      id: "toggle-reset-resources",
      html: '<svg style="width: 15px; height: 15px;" viewBox="0 0 48 48"><path fill="currentColor" d="M38.4 42 25.85 29.45l2.85-2.85 12.55 12.55ZM9.35 42 6.5 39.15 21 24.65l-5.35-5.35-1.15 1.15-2.2-2.2v4.25l-1.2 1.2L5 17.6l1.2-1.2h4.3L8.1 14l6.55-6.55q.85-.85 1.85-1.15 1-.3 2.2-.3 1.2 0 2.2.425 1 .425 1.85 1.275l-5.35 5.35 2.4 2.4-1.2 1.2 5.2 5.2 6.1-6.1q-.4-.65-.625-1.5-.225-.85-.225-1.8 0-2.65 1.925-4.575Q32.9 5.95 35.55 5.95q.75 0 1.275.15.525.15.875.4l-4.25 4.25 3.75 3.75 4.25-4.25q.25.4.425.975t.175 1.325q0 2.65-1.925 4.575Q38.2 19.05 35.55 19.05q-.9 0-1.55-.125t-1.2-.375Z"/></svg>',
      title: this._host.engine.i18n("ui.craft.resources"),
    }).addClass("ks-icon-button");
    const religionButton = $("<div/>", {
      id: "toggle-reset-religion",
      html: '<svg style="width: 15px; height: 15px;" viewBox="0 0 48 48"><path fill="currentColor" d="M2 42V14q0-2.3 1.6-3.9t3.9-1.6q2.3 0 3.9 1.6T13 14v1.55L24 6l11 9.55V14q0-2.3 1.6-3.9t3.9-1.6q2.3 0 3.9 1.6T46 14v28H26.5V32q0-1.05-.725-1.775Q25.05 29.5 24 29.5q-1.05 0-1.775.725Q21.5 30.95 21.5 32v10Zm36-25.5h5V14q0-1.05-.725-1.775-.725-.725-1.775-.725-1.05 0-1.775.725Q38 12.95 38 14Zm-33 0h5V14q0-1.05-.725-1.775Q8.55 11.5 7.5 11.5q-1.05 0-1.775.725Q5 12.95 5 14ZM5 39h5V19.5H5Zm8 0h5.5v-7q0-2.3 1.6-3.9t3.9-1.6q2.3 0 3.9 1.6t1.6 3.9v7H35V19.5L24 9.95 13 19.5Zm25 0h5V19.5h-5ZM24 22.75q-1.15 0-1.95-.8t-.8-1.95q0-1.15.8-1.95t1.95-.8q1.15 0 1.95.8t.8 1.95q0 1.15-.8 1.95t-1.95.8Z"/></svg>',
      title: this._host.engine.i18n("ui.faith"),
    }).addClass("ks-icon-button");
    const timeButton = $("<div/>", {
      id: "toggle-reset-time",
      html: '<svg style="width: 15px; height: 15px;" viewBox="0 0 48 48"><path fill="currentColor" d="m31.35 33.65 2.25-2.25-7.95-8V13.35h-3V24.6ZM24 44q-4.1 0-7.75-1.575-3.65-1.575-6.375-4.3-2.725-2.725-4.3-6.375Q4 28.1 4 24t1.575-7.75q1.575-3.65 4.3-6.375 2.725-2.725 6.375-4.3Q19.9 4 24 4t7.75 1.575q3.65 1.575 6.375 4.3 2.725 2.725 4.3 6.375Q44 19.9 44 24t-1.575 7.75q-1.575 3.65-4.3 6.375-2.725 2.725-6.375 4.3Q28.1 44 24 44Zm0-20Zm0 17q7 0 12-5t5-12q0-7-5-12T24 7q-7 0-12 5T7 24q0 7 5 12t12 5Z"/></svg>',
      title: this._host.engine.i18n("ui.time"),
    }).addClass("ks-icon-button");

    buildButton.on("click", () => {
      resetBuildList.element.toggle();
      resetSpaceList.element.toggle(false);
      resetResourcesList.element.toggle(false);
      resetReligionList.element.toggle(false);
      resetTimeList.element.toggle(false);
    });
    spaceButton.on("click", () => {
      resetBuildList.element.toggle(false);
      resetSpaceList.element.toggle();
      resetResourcesList.element.toggle(false);
      resetReligionList.element.toggle(false);
      resetTimeList.element.toggle(false);
    });
    resourcesButton.on("click", () => {
      resetBuildList.element.toggle(false);
      resetSpaceList.element.toggle(false);
      resetResourcesList.element.toggle();
      resetReligionList.element.toggle(false);
      resetTimeList.element.toggle(false);
    });
    religionButton.on("click", () => {
      resetBuildList.element.toggle(false);
      resetSpaceList.element.toggle(false);
      resetResourcesList.element.toggle(false);
      resetReligionList.element.toggle();
      resetTimeList.element.toggle(false);
    });
    timeButton.on("click", () => {
      resetBuildList.element.toggle(false);
      resetSpaceList.element.toggle(false);
      resetResourcesList.element.toggle(false);
      resetReligionList.element.toggle(false);
      resetTimeList.element.toggle();
    });

    element.element.append(
      buildButton,
      spaceButton,
      resourcesButton,
      religionButton,
      timeButton,
      resetBuildList.element,
      resetSpaceList.element,
      resetResourcesList.element,
      resetReligionList.element,
      resetTimeList.element
    );

    return element;
  }

  private _getOptionAccelerateTime(
    option: TimeControlSettings["accelerateTime"],
    label: string
  ): SettingTriggerListItem {
    return new SettingTriggerListItem(this._host, label, option, {
      onCheck: () => this._host.engine.imessage("status.auto.enable", [label]),
      onUnCheck: () => this._host.engine.imessage("status.auto.disable", [label]),
    });
  }

  private _getCycle(
    index: CycleIndices,
    option: TimeControlSettings["timeSkip"]
  ): JQuery<HTMLElement> {
    const cycle = this._host.gamePage.calendar.cycles[index];

    const element = $("<li/>");

    const label = $("<label/>", {
      text: cycle.title,
    });

    const input = $("<input/>", {
      type: "checkbox",
    });
    option[`$${index}` as const] = input;

    input.on("change", () => {
      if (input.is(":checked") && option[index] === false) {
        this._host.updateOptions(() => (option[index] = true));
        this._host.engine.imessage("time.skip.cycle.enable", [cycle.title]);
      } else if (!input.is(":checked") && option[index] === true) {
        this._host.updateOptions(() => (option[index] = false));
        this._host.engine.imessage("time.skip.cycle.disable", [cycle.title]);
      }
    });

    label.prepend(input);
    element.append(input);

    return element;
  }

  private _getSeasonForTimeSkip(season: Season, option: TimeSkipSettings): JQuery<HTMLElement> {
    const iseason = ucfirst(this._host.engine.i18n(`$calendar.season.${season}` as const));

    const element = $("<li/>");

    const label = $("<label/>", {
      text: ucfirst(iseason),
    });

    const input = $("<input/>", {
      type: "checkbox",
    });
    option[`$${season}` as const] = input;

    input.on("change", () => {
      if (input.is(":checked") && option[season] === false) {
        this._host.updateOptions(() => (option[season] = true));
        this._host.engine.imessage("time.skip.season.enable", [iseason]);
      } else if (!input.is(":checked") && option[season] === true) {
        this._host.updateOptions(() => (option[season] = false));
        this._host.engine.imessage("time.skip.season.disable", [iseason]);
      }
    });

    label.prepend(input);
    element.append(label);

    return element;
  }

  setState(state: TimeControlSettings): void {
    this._settings.enabled = state.enabled;

    this._settings.accelerateTime.enabled = state.accelerateTime.enabled;
    this._settings.accelerateTime.trigger = state.accelerateTime.trigger;

    this._settings.reset.enabled = state.reset.enabled;

    this._settings.timeSkip.enabled = state.timeSkip.enabled;
    this._settings.timeSkip.trigger = state.timeSkip.trigger;
    this._settings.timeSkip.autumn = state.timeSkip.autumn;
    this._settings.timeSkip.spring = state.timeSkip.spring;
    this._settings.timeSkip.summer = state.timeSkip.summer;
    this._settings.timeSkip.winter = state.timeSkip.winter;
    this._settings.timeSkip[0] = state.timeSkip[0];
    this._settings.timeSkip[1] = state.timeSkip[1];
    this._settings.timeSkip[2] = state.timeSkip[2];
    this._settings.timeSkip[3] = state.timeSkip[3];
    this._settings.timeSkip[4] = state.timeSkip[4];
    this._settings.timeSkip[5] = state.timeSkip[5];
    this._settings.timeSkip[6] = state.timeSkip[6];
    this._settings.timeSkip[7] = state.timeSkip[7];
    this._settings.timeSkip[8] = state.timeSkip[8];
    this._settings.timeSkip[9] = state.timeSkip[9];

    for (const [name, option] of objectEntries(this._settings.bonfireBuildings.items)) {
      option.enabled = state.bonfireBuildings.items[name].enabled;
      option.trigger = state.bonfireBuildings.items[name].trigger;
    }
    for (const [name, option] of objectEntries(this._settings.religionItems.items)) {
      option.enabled = state.religionItems.items[name].enabled;
      option.trigger = state.religionItems.items[name].trigger;
    }
    for (const [name, option] of objectEntries(this._settings.spaceItems.items)) {
      option.enabled = state.spaceItems.items[name].enabled;
      option.trigger = state.spaceItems.items[name].trigger;
    }
    for (const [name, option] of objectEntries(this._settings.timeItems.items)) {
      option.enabled = state.timeItems.items[name].enabled;
      option.trigger = state.timeItems.items[name].trigger;
    }

    for (const [name, option] of objectEntries(state.resources.items)) {
      option.enabled = state.resources.items[name].enabled;
      option.stock = state.resources.items[name].stock;
    }
  }
}
