"use strict";
const utils = require('@iobroker/adapter-core');
const moment = require("moment");
const momentDurationFormatSetup = require("moment-duration-format");
//**********************************************************************************************************************************************************
//******************************************************************Variable********************************************************************************
//**********************************************************************************************************************************************************
//===========================Global
var IDName = '',
    PresenceObject = '',
    PresenceTime = '',
    PresenceStamp = '',
    PresenceState = '',
    AbsentSince = '';
var DeviceIDName = '',
    DeviceType = '',
    OnState = '',
    OnObject = '',
    OnObjectString = '',
    OffState = '',
    OffObject = '',
    OffObjectString = '',
    Illumination = '';
var ObjectToCommandon = '',
    StringToCommandon = '',
    ObjectToCommandoff = '',
    StringToCommandoff = '';
var MotionObject = '',
    MotionObjectString = '',
    IlluminationObject = '',
    IlluminationValue = '',
    MotionTimeValue = '',
    MotionIlluminationActiv = '';
var ReedObject = '',
    ReedObjectString = '',
    ReedTimeValue = '',
    ReedCountdownValue = '',
    EntranceState = '';
var OtherObject = '',
    OtherObjectValue = '',
    OtherTimeValue = '',
    OtherCountdownValue = '';
var TimerObject = '',
    TimerTimeValue = '',
    TimerCountdownValue = '';
var Schedule_Enabled = '',
    Schedule_Start = '',
    Schedule_End = '',
    Schedule_Monday = '',
    Schedule_Tuesday = '',
    Schedule_Wednesday = '',
    Schedule_Thursday = '',
    Schedule_Friday = '',
    Schedule_Saturday = '',
    Schedule_Sunday = '';
var Speach = '',
    SpeachString = '',
    AlarmNumber = '',
    activate = '';
//========================All Devices
var devicearray = {};
var Adapterarray = [];
//========================Echo
var MyEchos = [];
//========================Reed
var Timer = [];
var TimerReed = [];
var Reedcountdown = [];
var ReedTimestamp = [];
//========================Family
var Familyarray = {};
var GlobalFamArray = [];
var Familycountdown = [];
var FamilyTimestamp = [];
var FamilyDatestamp = [];
//========================Other
var TimerOther = [];
var Othercountdown = [];
var OtherTimestamp = [];
//========================Timer
var TimerTimer = [];
var Timercountdown = [];
var TimerTimestamp = [];
//========================Alarm / level 3
var startLevelThreeTimer = Date.now();
var StartCountdownAlarmThree;
var PresentGhost = false;
var AlarmIsThree = false;
var AlarmIsActivThree = false;
var SubsLevelThreeTimer = Date.now();
//========================Settings
var SpeakObject = '',
    TelegramObject = '',
    AlarmObject = 2,
    OldAlarmObject = 2,
    SendAlarmChanges = 'true',
    AlarmCountdownValue = 60,
    AlarmVoice = 'true',
    Welcomephrase = 'Welcome Home',
    WarningphraseEntrance = 'Attention! entrance is open since',
    WarningphraseMotion = 'Attention! Movement was detected',
    VoiceResetLevel = "I'm here",
    VoiceChangeLevel = 'Alarm to level',
    AdapterSystemTime = '';
var CommandSPTG = {
    SpeakObject: '',
    TelegramObject: '',
    AlarmObject: 2,
    OldAlarmObject: 2,
    SendAlarmChanges: true,
    AlarmCountdownValue: 60,
    AlarmVoice: true,
    Welcomephrase: 'Welcome Home',
    WarningphraseEntrance: 'Attention! entrance is open since',
    WarningphraseMotion: 'Attention! Movement was detected',
    VoiceResetLevel: "I'm here",
    VoiceChangeLevel: 'Alarm to level',
    AdapterSystemTime: ''
};
//========================Global / Translate
var enlang = 'en',
    delang = 'de',
    rulang = 'ru',
    ptlang = 'pt',
    nllang = 'nl',
    frlang = 'fr',
    itlang = 'it',
    eslang = 'es',
    pllang = 'pl',
    zhcnlang = 'zh-cn';
var Alllanguages = [enlang, delang, rulang, ptlang, nllang, frlang, itlang, eslang, pllang, zhcnlang];
var Mylanguage = 'en';
var Alarmwaschangedfromlevel = {
        [enlang]: "Alarm was changed from level ",
        [delang]: "Alarm wurde geändert von Stufe ",
        [rulang]: "Тревога была изменена с уровня",
        [ptlang]: "O alarme foi alterado do nível",
        [nllang]: "Alarm is gewijzigd van niveau",
        [frlang]: "L'alarme a été modifiée par rapport au niveau",
        [itlang]: "L'allarme è stato modificato dal livello",
        [eslang]: "La alarma se cambió del nivel",
        [pllang]: "Alarm został zmieniony z poziomu",
        [zhcnlang]: "警报已从级别更改"
    },
    to = {
        [enlang]: " to ",
        [delang]: " zu ",
        [rulang]: " к ",
        [ptlang]: " para ",
        [nllang]: " naar ",
        [frlang]: " à ",
        [itlang]: " per ",
        [eslang]: " a ",
        [pllang]: " do ",
        [zhcnlang]: " 至 "
    },
    Thealarmsystemhasbeenactivated = {
        [enlang]: "The alarm system has been activated!",
        [delang]: "Die Alarmanlage ist scharf geschaltet!",
        [rulang]: "Сработала сигнализация!",
        [ptlang]: "O sistema de alarme foi ativado!",
        [nllang]: "Het alarmsysteem is geactiveerd!",
        [frlang]: "Le système d'alarme a été activé!",
        [itlang]: "Il sistema di allarme è stato attivato!",
        [eslang]: "¡El sistema de alarma se ha activado!",
        [pllang]: "System alarmowy został aktywowany!",
        [zhcnlang]: "警报系统已激活！"
    },
    Thealarmsystemwillbeactivatedin = {
        [enlang]: "The alarm system will be activated in ",
        [delang]: "Die Alarmanlage wird scharf geschaltet in ",
        [rulang]: "Система охранной сигнализации будет активирована через ",
        [ptlang]: "O sistema de alarme será ativado em ",
        [nllang]: "Het alarmsysteem wordt geactiveerd in ",
        [frlang]: "Le système d'alarme sera activé dans ",
        [itlang]: "Il sistema di allarme verrà attivato in ",
        [eslang]: "El sistema de alarma se activará en ",
        [pllang]: "System alarmowy zostanie uruchomiony za ",
        [zhcnlang]: "警报系统将在"
    },
    Thealarmcountdowniscanceled = {
        [enlang]: "The alarm countdown is canceled",
        [delang]: "Der Alarm-Countdown wird abgebrochen",
        [rulang]: "Обратный отсчет будильника отменен",
        [ptlang]: "A contagem regressiva do alarme foi cancelada",
        [nllang]: "Het aftellen van het alarm wordt geannuleerd",
        [frlang]: "Le compte à rebours de l'alarme est annulé",
        [itlang]: "Il conto alla rovescia dell'allarme viene annullato",
        [eslang]: "La cuenta atrás de la alarma se cancela",
        [pllang]: "Odliczanie alarmu zostaje anulowane",
        [zhcnlang]: "闹铃倒计时取消"
    },
    Thealarmsystemissettolevel = {
        [enlang]: "The alarm system is set to level 3",
        [delang]: "Die Alarmanlage ist auf Stufe 3 eingestellt",
        [rulang]: "Аварийная сигнализация установлена на 3 уровень.",
        [ptlang]: "O sistema de alarme está definido para o nível 3",
        [nllang]: "Het alarmsysteem is ingesteld op niveau 3",
        [frlang]: "Le système d'alarme est réglé au niveau 3",
        [itlang]: "Il sistema di allarme è impostato al livello 3",
        [eslang]: "El sistema de alarma está configurado en el nivel 3",
        [pllang]: "System alarmowy jest ustawiony na poziom 3",
        [zhcnlang]: "警报系统设置为3级"
    },
    statechanged = {
        [enlang]: "state changed",
        [delang]: "zustand geändert",
        [rulang]: "состояние изменено",
        [ptlang]: "estado mudou",
        [nllang]: "staat veranderd",
        [frlang]: "état changé",
        [itlang]: "stato cambiato",
        [eslang]: "estado cambiado",
        [pllang]: "stan zmieniony",
        [zhcnlang]: "状态改变"
    },
    switchedon = {
        [enlang]: "switched on",
        [delang]: "eingeschaltet",
        [rulang]: "включено",
        [ptlang]: "ligado",
        [nllang]: "ingeschakeld",
        [frlang]: "allumé",
        [itlang]: "acceso",
        [eslang]: "encendido",
        [pllang]: "włączony",
        [zhcnlang]: "切换到"
    },
    switchedoff = {
        [enlang]: "switched off",
        [delang]: "ausgeschaltet",
        [rulang]: "выключен",
        [ptlang]: "desligado",
        [nllang]: "uit",
        [frlang]: "éteint",
        [itlang]: "spento",
        [eslang]: "apagado",
        [pllang]: "wyłączony",
        [zhcnlang]: "关掉"
    },
    Hourand = {
        [enlang]: " Hour and ",
        [delang]: " Stunde und ",
        [rulang]: " Час и ",
        [ptlang]: " Hora e ",
        [nllang]: " Uur en ",
        [frlang]: " Heure et ",
        [itlang]: " Ora e ",
        [eslang]: " Hora y ",
        [pllang]: " Godzina i ",
        [zhcnlang]: " 小时和 "
    },
    Hoursand = {
        [enlang]: " Hours and ",
        [delang]: " Stunden und ",
        [rulang]: " Часы и ",
        [ptlang]: " Horas e ",
        [nllang]: " Uren en ",
        [frlang]: " Heures et ",
        [itlang]: " Ore e ",
        [eslang]: " Horas y ",
        [pllang]: " Godziny i ",
        [zhcnlang]: " 小时和"
    },
    Minuteand = {
        [enlang]: " Minute and ",
        [delang]: " Minute und ",
        [rulang]: " Минуты и ",
        [ptlang]: " Minuto e ",
        [nllang]: " Minuut en ",
        [frlang]: " Minute et ",
        [itlang]: " Minuto e ",
        [eslang]: " Minuto y ",
        [pllang]: " Minuta i ",
        [zhcnlang]: " 分钟和 "
    },
    Minutesand = {
        [enlang]: " Minutes and ",
        [delang]: " Minuten und ",
        [rulang]: " Минуты и ",
        [ptlang]: " Minutos e ",
        [nllang]: " Minuten en ",
        [frlang]: " Minutes et ",
        [itlang]: " Minuti e ",
        [eslang]: " Minutos y ",
        [pllang]: " Protokoły i ",
        [zhcnlang]: " 分钟和 "
    },
    Second = {
        [enlang]: " Second ",
        [delang]: " Zweite",
        [rulang]: " Второй",
        [ptlang]: " Segundo",
        [nllang]: " Tweede",
        [frlang]: " Seconde",
        [itlang]: " Secondo",
        [eslang]: " Segundo",
        [pllang]: " druga",
        [zhcnlang]: " 第二"
    },
    Seconds = {
        [enlang]: " Seconds ",
        [delang]: " Sekunden",
        [rulang]: " Секунды",
        [ptlang]: " Segundos",
        [nllang]: " Seconden",
        [frlang]: " Secondes",
        [itlang]: " Secondi",
        [eslang]: " Segundos",
        [pllang]: " sekundy",
        [zhcnlang]: " 秒"
    },
    Levelzero = {
        [enlang]: "zero",
        [delang]: "null",
        [rulang]: "нуль",
        [ptlang]: "zero",
        [nllang]: "nul",
        [frlang]: "zéro",
        [itlang]: "zero",
        [eslang]: "cero",
        [pllang]: "zero",
        [zhcnlang]: "零"
    },
    Levelone = {
        [enlang]: "one",
        [delang]: "eins",
        [rulang]: "один",
        [ptlang]: "1",
        [nllang]: "een",
        [frlang]: "un",
        [itlang]: "uno",
        [eslang]: "uno",
        [pllang]: "jeden",
        [zhcnlang]: "之一"
    },
    Leveltwo = {
        [enlang]: "two",
        [delang]: "zwei",
        [rulang]: "два",
        [ptlang]: "dois",
        [nllang]: "twee",
        [frlang]: "deux",
        [itlang]: "Due",
        [eslang]: "dos",
        [pllang]: "dwa",
        [zhcnlang]: "二"
    },
    Levelthree = {
        [enlang]: "three",
        [delang]: "drei",
        [rulang]: "три",
        [ptlang]: "três",
        [nllang]: "drie",
        [frlang]: "trois",
        [itlang]: "tre",
        [eslang]: "Tres",
        [pllang]: "trzy",
        [zhcnlang]: "三"
    };
class alarmcontrol extends utils.Adapter {
        //**********************************************************************************************************************************************************
        //******************************************************************Register event**************************************************************************
        //**********************************************************************************************************************************************************
        constructor(options) {
                super({...options,
                    name: "alarmcontrol",
                });
                this.on("ready", this.onReady.bind(this));
                this.on("objectChange", this.onObjectChange.bind(this));
                this.on("stateChange", this.onStateChange.bind(this));
                this.on("message", this.onMessage.bind(this));
                this.on("unload", this.onUnload.bind(this));
            }
            //**********************************************************************************************************************************************************
            //*************************************************************************Load*****************************************************************************
            //**********************************************************************************************************************************************************
        async onReady() {
                const Adapter = this;
                Adapter.log.debug('Starting alarmcontrol');
                await Adapter.setStateAsync('info.connection', true, true);
                Adapter.createChannelAsync('Settings', 'Settings');
                await Adapter.setObjectNotExistsAsync('Settings', {
                    type: "channel",
                    common: {
                        name: 'Settings',
                        write: false
                    },
                    native: {}
                });
                Adapter.getForeignObject('system.config', (err, SysConfig) => {
                    Mylanguage = SysConfig.common.language;
                    for (let idx = 0; idx < Alllanguages.length; idx++) {
                        if (Alllanguages[idx] == Mylanguage) {
                            Mylanguage = Alllanguages[idx];
                        }
                    }
                });
                //===============================================Settings============================================
                for (const [key, value] of Object.entries(CommandSPTG)) {
                    var typeWrite = 'string',
                        roleWrite = 'text';
                    if ((value == true) || (value == false)) {
                        typeWrite = 'boolean', roleWrite = 'switch';
                    }
                    var CheckiObject = await Adapter.getStateAsync("Settings." + key);
                    await Adapter.setObjectNotExistsAsync("Settings." + key, {
                        type: "state",
                        common: {
                            name: key,
                            desc: key,
                            type: typeWrite,
                            role: roleWrite,
                            write: true
                        },
                        native: {}
                    });
                    if (CheckiObject == undefined) {
                        Adapter.setStateAsync("Settings." + key, value, true);
                    }
                }
                Adapter.setStateAsync("Settings.AdapterSystemTime", Adapter.getMyTime(), true);
                setInterval(function() {
                    Adapter.setStateAsync("Settings.AdapterSystemTime", Adapter.getMyTime(), true);
                }, 1000 * 60);
                setInterval(function() {
                    Adapter.checkTimerStart();
                }, 1000);
                Adapter.subscribeStates('*');
                SpeakObject = await Adapter.getStateAsync('Settings.SpeakObject');
                let TelegramObject = await Adapter.getStateAsync('Settings.TelegramObject');
                let AlarmObject = await Adapter.getStateAsync('Settings.AlarmObject');
                let OldAlarmObject = await Adapter.getStateAsync('Settings.OldAlarmObject');
                let SendAlarmChanges = await Adapter.getStateAsync('Settings.SendAlarmChanges');
                let AlarmCountdownValue = await Adapter.getStateAsync('Settings.AlarmCountdownValue');
                let AlarmVoice = await Adapter.getStateAsync('Settings.AlarmVoice');
                let Welcomephrase = await Adapter.getStateAsync('Settings.Welcomephrase');
                let WarningphraseEntrance = await Adapter.getStateAsync('Settings.WarningphraseEntrance');
                let WarningphraseMotion = await Adapter.getStateAsync('Settings.WarningphraseMotion');
                let VoiceResetLevel = await Adapter.getStateAsync('Settings.VoiceResetLevel');
                let VoiceChangeLevel = await Adapter.getStateAsync('Settings.VoiceChangeLevel');
                CommandSPTG = {
                    AlarmObject: AlarmObject.val,
                    OldAlarmObject: OldAlarmObject.val,
                    SpeakObject: SpeakObject.val,
                    TelegramObject: TelegramObject.val,
                    SendAlarmChanges: SendAlarmChanges.val,
                    AlarmCountdownValue: AlarmCountdownValue.val,
                    AlarmVoice: AlarmVoice.val,
                    Welcomephrase: Welcomephrase.val,
                    WarningphraseEntrance: WarningphraseEntrance.val,
                    WarningphraseMotion: WarningphraseMotion.val,
                    VoiceResetLevel: VoiceResetLevel,
                    VoiceChangeLevel: VoiceChangeLevel
                };
                if ((CommandSPTG.VoiceResetLevel) || (CommandSPTG.VoiceChangeLevel)) {
                    Adapter.subscribeForeignStates('alexa2.0.History.summary');
                    if (CommandSPTG.VoiceResetLevel) {
                        CommandSPTG.VoiceResetLevel = VoiceResetLevel.val;
                    }
                    if (CommandSPTG.VoiceChangeLevel) {
                        CommandSPTG.VoiceChangeLevel = VoiceChangeLevel.val;
                    }
                }
                let Familyarray = {};
                let LogTextString = "",
                    LogTextNumber = 0;
                let Familynumber = await Adapter.getDevicesAsync('');
                for (let idx = 0; idx < Familynumber.length; idx++) {
                    let AllMyFamilyname = await Adapter.getChannelsOfAsync(Familynumber[idx].common.name);
                    let MyFamilyname = Familynumber[idx].common.name;
                    for (let idxS = 0; idxS < AllMyFamilyname.length; idxS++) {
                        let MyChannelname = AllMyFamilyname[idxS].common.name;
                        if (MyFamilyname == "Family") {
                            LogTextString += MyChannelname + ' | '
                            LogTextNumber += 1
                            let IDName = await Adapter.getStateAsync(MyFamilyname + "." + MyChannelname + '.IDName');
                            let PresenceObject = await Adapter.getStateAsync(MyFamilyname + "." + MyChannelname + '.PresenceObject');
                            let PresenceTime = await Adapter.getStateAsync(MyFamilyname + "." + MyChannelname + '.PresenceTime');
                            let PresenceStamp = await Adapter.getStateAsync(MyFamilyname + "." + MyChannelname + '.PresenceStamp');
                            let PresenceState = await Adapter.getStateAsync(MyFamilyname + "." + MyChannelname + '.PresenceState');
                            let AbsentSince = await Adapter.getStateAsync(MyFamilyname + "." + MyChannelname + '.AbsentSince');
                            let Active = await Adapter.getStateAsync(MyFamilyname + "." + MyChannelname + '.Active');
                            Familyarray[MyChannelname] = {
                                IDName: IDName.val,
                                PresenceObject: PresenceObject.val,
                                PresenceTime: PresenceTime.val,
                                PresenceStamp: PresenceStamp.val,
                                PresenceState: PresenceState.val,
                                AbsentSince: AbsentSince.val,
                                Active: Active.val
                            };
                        }
                    }
                }
                GlobalFamArray = [];
                GlobalFamArray.push(Familyarray);
                let devicearray = {};
                let LogTextStringSwitch = "",
                    LogTextNumberSwitch = 0;
                let LogTextStringMotion = "",
                    LogTextNumberMotion = 0;
                let LogTextStringReed = "",
                    LogTextNumberReed = 0;
                let LogTextStringOther = "",
                    LogTextNumberOther = 0;
                let LogTextStringTimer = "",
                    LogTextNumberTimer = 0;
                let devicenumber = await Adapter.getDevicesAsync('');
                for (let idx = 0; idx < devicenumber.length; idx++) {
                    let AllMyDevicename = await Adapter.getChannelsOfAsync(devicenumber[idx].common.name);
                    let MyDevicename = devicenumber[idx].common.name;
                    for (let idxS = 0; idxS < AllMyDevicename.length; idxS++) {
                        let MyChannelname = AllMyDevicename[idxS].common.name;
                        /*******************************************************Filter All************************************************************************************/
                        let DeviceIDName = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.DeviceIDName');
                        let DeviceType = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.DeviceType');
                        let Schedule_Enabled = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.Schedule_Enabled');
                        let Schedule_Start = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.Schedule_Start');
                        let Schedule_End = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.Schedule_End');
                        let Schedule_Monday = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.Schedule_Monday');
                        let Schedule_Tuesday = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.Schedule_Tuesday');
                        let Schedule_Wednesday = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.Schedule_Wednesday');
                        let Schedule_Thursday = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.Schedule_Thursday');
                        let Schedule_Friday = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.Schedule_Friday');
                        let Schedule_Saturday = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.Schedule_Saturday');
                        let Schedule_Sunday = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.Schedule_Sunday');
                        let Speach = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.Speach');
                        let Echos = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.Echos');
                        if (Echos == undefined) {
                            await Adapter.setObjectNotExistsAsync(MyDevicename + "." + MyChannelname + '.Echos', {
                                type: "state",
                                common: {
                                    name: 'Echos',
                                    desc: 'Echos',
                                    type: 'string',
                                    role: 'text',
                                    write: false
                                },
                                native: {}
                            });
                            Adapter.setStateAsync(MyDevicename + "." + MyChannelname + '.Echos', "MyEcho", true);
                        }
                        let SpeachString = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.SpeachString');
                        let AlarmNumber = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.AlarmNumber');
                        let activate = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.activate');
                        switch (MyDevicename) {
                            /*******************************************************Switch************************************************************************************/
                            case "Switch":
                                LogTextStringSwitch += MyChannelname + ' | ';
                                LogTextNumberSwitch += 1;
                                let OnState = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.OnState');
                                let OnObject = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.OnObject');
                                let OnObjectString = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.OnObjectString');
                                let OffState = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.OffState');
                                let OffObject = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.OffObject');
                                let OffObjectString = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.OffObjectString');
                                let trigerswitch = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.trigerswitch');
                                devicearray[MyChannelname] = {
                                    DeviceIDName: DeviceIDName.val,
                                    DeviceType: DeviceType.val,
                                    OnState: OnState.val,
                                    OnObject: OnObject.val,
                                    OnObjectString: OnObjectString.val,
                                    OffState: OffState.val,
                                    OffObject: OffObject.val,
                                    OffObjectString: OffObjectString.val,
                                    Schedule_Enabled: Schedule_Enabled,
                                    Schedule_Start: Schedule_Start.val,
                                    Schedule_End: Schedule_End.val,
                                    Schedule_Monday: Schedule_Monday.val,
                                    Schedule_Tuesday: Schedule_Tuesday.val,
                                    Schedule_Wednesday: Schedule_Wednesday.val,
                                    Schedule_Thursday: Schedule_Thursday.val,
                                    Schedule_Friday: Schedule_Friday.val,
                                    Schedule_Saturday: Schedule_Saturday.val,
                                    Schedule_Sunday: Schedule_Sunday.val,
                                    Speach: Speach.val,
                                    Echos: Echos.val,
                                    SpeachString: SpeachString.val,
                                    AlarmNumber: AlarmNumber.val,
                                    trigerswitch: trigerswitch.val,
                                    activate: activate.val
                                };
                                //Adapter.log.info("Switchs: " + JSON.stringify(devicearray));
                                //Adapter.log.info('Found: ' + LogTextNumberSwitch + ' Switchs: ' + LogTextStringSwitch);
                                break;
                                /*******************************************************Switch************************************************************************************/
                            case "Reed":
                                LogTextStringReed += MyChannelname + ' | ';
                                LogTextNumberReed += 1;
                                let ReedObject = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.ReedObject');
                                let ReedObjectString = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.ReedObjectString');
                                let EntranceState = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.EntranceState');
                                let ReedTimeValue = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.ReedTimeValue');
                                let ReedCountdownValue = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.ReedCountdownValue');
                                devicearray[MyChannelname] = {
                                    DeviceIDName: DeviceIDName.val,
                                    DeviceType: DeviceType.val,
                                    ReedObject: ReedObject.val,
                                    ReedObjectString: ReedObjectString.val,
                                    EntranceState: EntranceState.val,
                                    ReedTimeValue: ReedTimeValue.val,
                                    ReedCountdownValue: ReedCountdownValue.val,
                                    Schedule_Enabled: Schedule_Enabled,
                                    Schedule_Start: Schedule_Start.val,
                                    Schedule_End: Schedule_End.val,
                                    Schedule_Monday: Schedule_Monday.val,
                                    Schedule_Tuesday: Schedule_Tuesday.val,
                                    Schedule_Wednesday: Schedule_Wednesday.val,
                                    Schedule_Thursday: Schedule_Thursday.val,
                                    Schedule_Friday: Schedule_Friday.val,
                                    Schedule_Saturday: Schedule_Saturday.val,
                                    Schedule_Sunday: Schedule_Sunday.val,
                                    Speach: Speach.val,
                                    Echos: Echos.val,
                                    SpeachString: SpeachString.val,
                                    AlarmNumber: AlarmNumber.val,
                                    activate: activate.val
                                };
                                //Adapter.log.info("Switchs: " + JSON.stringify(devicearray));
                                //Adapter.log.info('Found: ' + LogTextNumberSwitch + ' Switchs: ' + LogTextStringSwitch);
                                break;
                                /*******************************************************MOTIONS************************************************************************************/
                            case "Motion":
                                LogTextStringMotion += MyChannelname + ' | ';
                                LogTextNumberMotion += 1;
                                let MotionObject = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.MotionObject');
                                let MotionObjectString = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.MotionObjectString');
                                let MotionIlluminationActiv = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.MotionIlluminationActiv');
                                let IlluminationObject = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.IlluminationObject');
                                let IlluminationValue = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.IlluminationValue');
                                let MotionTimeValue = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.MotionTimeValue');
                                devicearray[MyChannelname] = {
                                        DeviceIDName: DeviceIDName.val,
                                        DeviceType: DeviceType.val,
                                        MotionObject: MotionObject.val,
                                        MotionObjectString: MotionObjectString.val,
                                        IlluminationObject: IlluminationObject.val,
                                        MotionIlluminationActiv: MotionIlluminationActiv.val,
                                        IlluminationValue: IlluminationValue.val,
                                        MotionTimeValue: MotionTimeValue.val,
                                        Schedule_Enabled: Schedule_Enabled,
                                        Schedule_Start: Schedule_Start.val,
                                        Schedule_End: Schedule_End.val,
                                        Schedule_Monday: Schedule_Monday.val,
                                        Schedule_Tuesday: Schedule_Tuesday.val,
                                        Schedule_Wednesday: Schedule_Wednesday.val,
                                        Schedule_Thursday: Schedule_Thursday.val,
                                        Schedule_Friday: Schedule_Friday.val,
                                        Schedule_Saturday: Schedule_Saturday.val,
                                        Schedule_Sunday: Schedule_Sunday.val,
                                        Speach: Speach.val,
                                        Echos: Echos.val,
                                        SpeachString: SpeachString.val,
                                        AlarmNumber: AlarmNumber.val,
                                        activate: activate.val
                                    }
                                    //Adapter.log.info("Motions: " + JSON.stringify(devicearray));
                                    //Adapter.log.info('Found: ' + LogTextNumberMotion + ' Motions: ' + LogTextStringMotion);
                                break;
                            case "Other":
                                LogTextStringOther += MyChannelname + ' | ';
                                LogTextNumberOther += 1;
                                let OtherObject = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.OtherObject');
                                let OtherObjectValue = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.OtherObjectValue');
                                let OtherTimeValue = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.OtherTimeValue');
                                let OtherCountdownValue = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.OtherCountdownValue');
                                devicearray[MyChannelname] = {
                                    DeviceIDName: DeviceIDName.val,
                                    DeviceType: DeviceType.val,
                                    OtherObject: OtherObject.val,
                                    OtherObjectValue: OtherObjectValue.val,
                                    OtherTimeValue: OtherTimeValue.val,
                                    OtherCountdownValue: OtherCountdownValue.val,
                                    Schedule_Enabled: Schedule_Enabled,
                                    Schedule_Start: Schedule_Start.val,
                                    Schedule_End: Schedule_End.val,
                                    Schedule_Monday: Schedule_Monday.val,
                                    Schedule_Tuesday: Schedule_Tuesday.val,
                                    Schedule_Wednesday: Schedule_Wednesday.val,
                                    Schedule_Thursday: Schedule_Thursday.val,
                                    Schedule_Friday: Schedule_Friday.val,
                                    Schedule_Saturday: Schedule_Saturday.val,
                                    Schedule_Sunday: Schedule_Sunday.val,
                                    Speach: Speach.val,
                                    Echos: Echos.val,
                                    SpeachString: SpeachString.val,
                                    AlarmNumber: AlarmNumber.val,
                                    activate: activate.val
                                };
                                //Adapter.log.info("Others: " + JSON.stringify(devicearray));
                                //Adapter.log.info('Found: ' + LogTextNumberOther + ' Others: ' + LogTextStringOther);
                                break;
                            case "Timer":
                                LogTextStringTimer += MyChannelname + ' | ';
                                LogTextNumberTimer += 1;
                                let TimerObject = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.TimerObject');
                                let TimerTimeValue = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.TimerTimeValue');
                                let TimerCountdownValue = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.TimerCountdownValue');
                                devicearray[MyChannelname] = {
                                    DeviceIDName: DeviceIDName.val,
                                    DeviceType: DeviceType.val,
                                    TimerObject: TimerObject.val,
                                    TimerTimeValue: TimerTimeValue.val,
                                    TimerCountdownValue: TimerCountdownValue.val,
                                    Schedule_Enabled: Schedule_Enabled,
                                    Schedule_Start: Schedule_Start.val,
                                    Schedule_End: Schedule_End.val,
                                    Schedule_Monday: Schedule_Monday.val,
                                    Schedule_Tuesday: Schedule_Tuesday.val,
                                    Schedule_Wednesday: Schedule_Wednesday.val,
                                    Schedule_Thursday: Schedule_Thursday.val,
                                    Schedule_Friday: Schedule_Friday.val,
                                    Schedule_Saturday: Schedule_Saturday.val,
                                    Schedule_Sunday: Schedule_Sunday.val,
                                    Speach: Speach.val,
                                    Echos: Echos.val,
                                    SpeachString: SpeachString.val,
                                    AlarmNumber: AlarmNumber.val,
                                    activate: activate.val
                                };
                                //Adapter.log.info("Timers: " + JSON.stringify(devicearray));
                                //Adapter.log.info('Found: ' + LogTextNumberTimer + ' Timers: ' + LogTextStringTimer);
                                var TimeTimerIndex = [devicearray[MyChannelname].DeviceType + "-" + devicearray[MyChannelname].DeviceIDName];
                                if (TimerTimer[TimeTimerIndex] === undefined) {
                                    TimerTimer.push(TimeTimerIndex);
                                    TimerTimer[TimeTimerIndex] = devicearray[MyChannelname].TimerObject
                                }
                                break;
                        }
                    }
                }
                Adapter.log.info("Adapter: databases are connected | The alarm is already set to level " + CommandSPTG.AlarmObject);
                Adapter.log.info('Found: ' + LogTextNumberSwitch + ' Switchs: ' + LogTextStringSwitch);
                Adapter.log.info('Found: ' + LogTextNumberReed + ' Reeds: ' + LogTextStringReed);
                Adapter.log.info('Found: ' + LogTextNumberMotion + ' Motions: ' + LogTextStringMotion);
                Adapter.log.info('Found: ' + LogTextNumberOther + ' Other: ' + LogTextStringOther);
                Adapter.log.info('Found: ' + LogTextNumberTimer + ' Timer: ' + LogTextStringTimer);
                Adapter.log.info("Settings ==> " + JSON.stringify(devicearray));
                Adapter.log.info('Found: ' + LogTextNumber + ' Family member: ' + LogTextString);
                Adapter.log.info('Family ==> ' + JSON.stringify(Familyarray));
                Adapter.main(devicearray, Familyarray);
                await Adapter.setState('Change', {
                    val: JSON.stringify(devicearray)
                });
            }
            //**********************************************************************************************************************************************************
            //***************************************************************************Main***************************************************************************
            //**********************************************************************************************************************************************************
        async main(i_devicearray, i_Familyarray) {
                const Adapter = this;
                for (let ArrayDev in i_devicearray) {
                    if (i_devicearray[ArrayDev].DeviceType == "Motion") {
                        Adapter.subscribeForeignStates(i_devicearray[ArrayDev].MotionObject);
                    } else if (i_devicearray[ArrayDev].DeviceType == "Reed") {
                        Adapter.subscribeForeignStates(i_devicearray[ArrayDev].ReedObject);
                    } else if (i_devicearray[ArrayDev].DeviceType == "Other") {
                        Adapter.subscribeForeignStates(i_devicearray[ArrayDev].OtherObject);
                    } else if (i_devicearray[ArrayDev].DeviceType == "Timer") {
                        //~ i_devicearray[ArrayDev].TimerObject;
                    }
                }
                for (let ArrayFam in i_Familyarray) {
                    if (i_Familyarray[ArrayFam].Active) {
                        Adapter.subscribeForeignStates(i_Familyarray[ArrayFam].PresenceObject);
                    }
                }
                Adapter.GetMyEchos();
                //**************************************Restart loop switch off***********************************************
                if (CommandSPTG.AlarmObject && CommandSPTG.AlarmObject.toString() == '3') {
                    AlarmIsActivThree = true;
                    AlarmIsThree = true;
                    //**************************************Subscribe all switch***********************************************
                    for (let ArrayDev in i_devicearray) {
                        if (i_devicearray[ArrayDev].DeviceType == "Switch") {
                            Adapter.subscribeForeignStates(i_devicearray[ArrayDev].OnObject);
                            Adapter.subscribeForeignStates(i_devicearray[ArrayDev].OffObject);
                        }
                    }
                }
            }
            //**********************************************************************************************************************************************************
            //***********************************************************************Alarm******************************************************************************
            //**********************************************************************************************************************************************************
        CheckAlarmState(strParent) {
            var strParent = "" + strParent;
            var fullArray = [];
            if (strParent !== undefined) {
                if (strParent.indexOf(',') == -1) {
                    fullArray.push(strParent);
                } else {
                    fullArray = strParent.split(',');
                }
            }
            var TestAlarm = fullArray.indexOf(CommandSPTG.AlarmObject.toString());
            var RetTestAlarm = (TestAlarm == '-1' ? false : true);
            return RetTestAlarm;
        }
        ChangeAlarmState(CheckNumber) {
            switch (CommandSPTG.AlarmObject.toString()) {
                case "0":
                    Adapter.setStateAsync('Settings.AlarmObject', '2', true);
                    break;
                case "1":
                    break;
                case "2":
                    break;
                case "3":
                    break;
                    Adapter.setStateAsync('Settings.AlarmObject', '2', true);
            }
        }
        async StartLevelThree(SendModeState) {
                const Adapter = this;
                if (Math.floor((Date.now() - startLevelThreeTimer) / 1000) < 10) {
                    //**********************Very important for the loop / AlarmIsActivThree = true;*********************************
                    Adapter.log.error("Time is less than 10 seconds, execution cannot be repeated! => " + Math.floor((Date.now() - startLevelThreeTimer) / 1000) + " seconds");
                    AlarmIsActivThree = true;
                    return;
                } else {
                    startLevelThreeTimer = Date.now();
                }
                Adapterarray = [];
                var GetChangeObjectJson = await Adapter.getStateAsync('Change');
                Adapter.log.info("The alarm system is set to 3, switch off " + GetChangeObjectJson);
                if (GetChangeObjectJson !== undefined) {
                    Adapterarray.push(JSON.parse(GetChangeObjectJson.val));
                    var TimeDelaySpeak = 0;
                    var WarnToSendString = '🚨 ' + Thealarmsystemissettolevel[Mylanguage] + '\n';
                    for (let ArrayDev in Adapterarray[0]) {
                        //**************************************Start loop switch off***********************************************
                        if (Adapterarray[0][ArrayDev].DeviceType == "Switch") {
                            //**************************************Subscribe all switch********************************************
                            Adapter.unsubscribeForeignStates(Adapterarray[0][ArrayDev].OnObject);
                            Adapter.unsubscribeForeignStates(Adapterarray[0][ArrayDev].OffObject);
                            setTimeout(function() {
                                Adapter.subscribeForeignStates(Adapterarray[0][ArrayDev].OnObject);
                                Adapter.subscribeForeignStates(Adapterarray[0][ArrayDev].OffObject);
                            }, 1000);
                            //================Check State
                            if (Adapterarray[0][ArrayDev].activate) {
                                TimeDelaySpeak += 1;
                                setTimeout(function() {
                                    var ObjectToCommandoff = Adapterarray[0][ArrayDev].OffObject;
                                    var StringToCommandoff = Adapterarray[0][ArrayDev].OffObjectString;
                                    if (CommandSPTG.AlarmVoice) {
                                        if (Adapterarray[0][ArrayDev].SpeachString) {
                                            Adapter.setForeignStateAsync(CommandSPTG.SpeakObject, Adapterarray[0][ArrayDev].SpeachString);
                                        }
                                    }
                                    var WarnToSendState = '';
                                    if (StringToCommandoff) {
                                        WarnToSendState = switchedon[Mylanguage];
                                    } else {
                                        WarnToSendState = switchedoff[Mylanguage];
                                    }
                                    WarnToSendString += "✔️ " + Adapterarray[0][ArrayDev].DeviceIDName + ' ➢ ' + statechanged[Mylanguage] + ' ➢ ' + WarnToSendState + '\n';
                                    Adapter.log.warn("The alarm system is set to 3, switch off " + Adapterarray[0][ArrayDev].DeviceIDName + " with: " + StringToCommandoff);
                                    if (/^#[0-9A-F]{6}$/i.test(StringToCommandoff)) { //Color
                                        Adapter.setForeignStateAsync(ObjectToCommandoff, StringToCommandoff);
                                    } else if ((/\d+/g.test(StringToCommandoff)) || (/true/g.test(StringToCommandoff)) || (/false/g.test(StringToCommandoff))) { // State
                                        Adapter.setForeignStateAsync(ObjectToCommandoff, eval(StringToCommandoff));
                                    } else { // Other
                                        Adapter.setForeignStateAsync(ObjectToCommandoff, StringToCommandoff);
                                    }
                                }, TimeDelaySpeak * 1000);
                            }
                        }
                    }
                    AlarmIsActivThree = true;
                    if (Math.floor((Date.now() - SubsLevelThreeTimer) / 1000) < 5) {
                        if (CommandSPTG.SendAlarmChanges) {
                            if (SendModeState) {
                                Adapter.setForeignStateAsync(CommandSPTG.TelegramObject, WarnToSendString);
                            } else {
                                return WarnToSendString;
                            }
                        }
                    } else {
                        SubsLevelThreeTimer = Date.now();
                    }
                }
            }
            //**********************************************************************************************************************************************************
            //**********************************************************************Family******************************************************************************
            //**********************************************************************************************************************************************************
        async GetFamilyPresentNumber() {
            const Adapter = this;
            var TotalFamilyP = 0;
            for (let iArFaml in GlobalFamArray[0]) {
                var GetAll = await Adapter.getStateAsync("Family." + GlobalFamArray[0][iArFaml].IDName + ".PresenceState");
                if (GetAll.val) {
                    TotalFamilyP += 1;
                }
            }
            Adapter.setStateAsync("Family.PresentNumber", TotalFamilyP, true);
            if ((TotalFamilyP == 0) || AlarmIsThree) {
                clearTimeout(StartCountdownAlarmThree);
                var DurationSetIt = CommandSPTG.AlarmCountdownValue;
                var StartCountdownAlarmThree = setInterval(function() {
                    if (PresentGhost) {
                        setTimeout(function() {
                            Adapter.setForeignStateAsync(CommandSPTG.SpeakObject, Thealarmcountdowniscanceled[Mylanguage]);
                        }, 1000);
                        clearTimeout(StartCountdownAlarmThree);
                    }
                    DurationSetIt -= 1;
                    var GetDiff = DurationSetIt;
                    if (CommandSPTG.AlarmVoice) {
                        if (GetDiff.toString().endsWith("0")) {
                            var SecConvertString = Adapter.convertsecondsString(GetDiff);
                            Adapter.setForeignStateAsync(CommandSPTG.SpeakObject, Thealarmsystemwillbeactivatedin[Mylanguage] + SecConvertString);
                            Adapter.log.warn(Thealarmsystemwillbeactivatedin[Mylanguage] + SecConvertString);
                        }
                    }
                    if ((DurationSetIt < 1) && !PresentGhost) {
                        clearTimeout(StartCountdownAlarmThree);
                        Adapter.setStateAsync('Settings.AlarmObject', '3', true);
                        Adapter.StartLevelThree(true);
                        if (CommandSPTG.AlarmVoice) {
                            Adapter.setForeignStateAsync(CommandSPTG.SpeakObject, Thealarmsystemhasbeenactivated[Mylanguage]);
                        }
                    }
                }, 1000);
            } else {
                Adapter.ChangeAlarmState(TotalFamilyP)
            }
        }
        CheckFamilyState(strduration, strFamilyArray, strFamilyIndex, strFamilyChange) {
                //~ IDName, PresenceObject, PresenceTime, PresenceStamp, PresenceState, AbsentSince, Active
                const Adapter = this;
                var timer = strduration,
                    minutes, seconds;
                var CountdownIndex = [strFamilyArray[strFamilyIndex].IDName];
                //****************************************Create Countdown*************************************************
                if (Familycountdown[CountdownIndex] === undefined) {
                    Familycountdown.push(CountdownIndex);
                    FamilyTimestamp.push(CountdownIndex);
                    FamilyDatestamp.push(CountdownIndex);
                    var iCdate = new Date();
                    var ICdate = iCdate.toString().replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/, '$2-$1-$3');
                    var ICtime = iCdate.toTimeString().split(' ')[0].split(':');
                    FamilyTimestamp[CountdownIndex] = ICtime[0] + ':' + ICtime[1] + ':' + ICtime[2];
                    FamilyDatestamp[CountdownIndex] = ICdate;
                } else {
                    //****************************************Clear Countdown*************************************************
                    clearTimeout(Familycountdown[CountdownIndex]);
                    Familycountdown[CountdownIndex] = null;
                    var iCdate = new Date();
                    var ICdate = iCdate.toString().replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/, '$2-$1-$3');
                    var ICtime = iCdate.toTimeString().split(' ')[0].split(':');
                    FamilyTimestamp[CountdownIndex] = ICtime[0] + ':' + ICtime[1] + ':' + ICtime[2];
                    FamilyDatestamp[CountdownIndex] = ICdate;
                }
                if (strFamilyChange) {
                    Adapter.setStateAsync("Family." + strFamilyArray[strFamilyIndex].IDName + ".PresenceState", strFamilyChange, true);
                    Adapter.setStateAsync("Family." + strFamilyArray[strFamilyIndex].IDName + ".PresenceStamp", FamilyTimestamp[CountdownIndex] + " " + FamilyDatestamp[CountdownIndex], true);
                    Adapter.setForeignStateAsync(CommandSPTG.SpeakObject, CommandSPTG.Welcomephrase.toString() + ' ' + strFamilyArray[strFamilyIndex].IDName);
                    //**********************************Reset Alarm to Level 2********************************************
                    Adapter.setStateAsync('Settings.AlarmObject', '2', true);
                    PresentGhost = false;
                    //****************************************************************************************************
                    Adapter.log.info(strFamilyArray[strFamilyIndex].IDName + " ===>:" + strFamilyChange + " " + FamilyTimestamp[CountdownIndex] + " " + FamilyDatestamp[CountdownIndex]);
                    clearTimeout(Familycountdown[CountdownIndex]);
                    Familycountdown[CountdownIndex] = null;
                    Adapter.GetFamilyPresentNumber();
                }
                Familycountdown[CountdownIndex] = setInterval(function() {
                    Adapter.setObjectNotExistsAsync("Family." + strFamilyArray[strFamilyIndex].IDName + ".countdown", {
                        type: "state",
                        common: {
                            name: 'countdown',
                            desc: 'countdown',
                            type: 'string',
                            role: 'text',
                            write: false
                        },
                        native: {}
                    });
                    Adapter.setObjectNotExistsAsync("Family." + strFamilyArray[strFamilyIndex].IDName + ".Entrance", {
                        type: "state",
                        common: {
                            name: 'Entrance',
                            desc: 'Entrance',
                            type: 'string',
                            role: 'text',
                            write: false
                        },
                        native: {}
                    });
                    Adapter.setObjectNotExistsAsync("Family.PresentNumber", {
                        type: "state",
                        common: {
                            name: 'PresentNumber',
                            desc: 'PresentNumber',
                            type: 'string',
                            role: 'text',
                            write: false
                        },
                        native: {}
                    });
                    var GetDiffFam = Adapter.gettimediff(FamilyTimestamp[CountdownIndex]);
                    Adapter.setStateAsync("Family." + strFamilyArray[strFamilyIndex].IDName + ".countdown", GetDiffFam, true);
                    if (--timer < 0) {
                        Adapter.setStateAsync("Family." + strFamilyArray[strFamilyIndex].IDName + ".PresenceState", strFamilyChange, true);
                        if (strFamilyChange) {
                            Adapter.setStateAsync("Family." + strFamilyArray[strFamilyIndex].IDName + ".PresenceStamp", FamilyTimestamp[CountdownIndex] + " " + FamilyDatestamp[CountdownIndex], true);
                            Adapter.setForeignStateAsync(CommandSPTG.SpeakObject, CommandSPTG.Welcomephrase.toString() + ' ' + strFamilyArray[strFamilyIndex].IDName);
                            //**********************************Reset Alarm to Level 2********************************************
                            Adapter.setStateAsync('Settings.AlarmObject', '2', true);
                            PresentGhost = false;
                            //****************************************************************************************************
                        } else {
                            Adapter.setStateAsync("Family." + strFamilyArray[strFamilyIndex].IDName + ".AbsentSince", FamilyTimestamp[CountdownIndex] + " " + FamilyDatestamp[CountdownIndex], true);
                        }
                        Adapter.log.info(strFamilyArray[strFamilyIndex].IDName + " ===>:" + strFamilyChange + " " + FamilyTimestamp[CountdownIndex] + " " + FamilyDatestamp[CountdownIndex]);
                        setTimeout(function() {
                            Adapter.GetFamilyPresentNumber();
                        }, 1000);
                        clearTimeout(Familycountdown[CountdownIndex]);
                        Familycountdown[CountdownIndex] = null;
                    }
                }, 1000);
            }
            //**********************************************************************************************************************************************************
            //**************************************************************************Echo****************************************************************************
            //**********************************************************************************************************************************************************
        async GetMyEchos() {
            const Adapter = this;
            MyEchos = [];
            var Echoelement = {};
            Adapter.getForeignStates("alexa2.0.Echo-Devices.*.speak", function(err, states) {
                for (var id in states) {
                    var Tempid = id.substring(0, id.lastIndexOf('.'));
                    Tempid = Tempid.substring(0, Tempid.lastIndexOf('.'));
                    let RetMyEchoName = new Promise((resolve, reject) => {
                        Adapter.getForeignObject(Tempid,
                            function(err, obj) {
                                if (err) {
                                    reject(err)
                                }
                                resolve(obj)
                            })
                    }).then((obj) => {
                        var TempId = obj._id;
                        var TempEchoId = TempId.substring(TempId.lastIndexOf('.'));
                        var Echoelement = {
                            EchoName: obj.common.name,
                            EchoId: TempEchoId,
                            EchoSpeak: TempId + '.Commands.speak'
                        };
                        MyEchos.push(Echoelement);
                        Adapter.log.info("Found: " + MyEchos[MyEchos.length - 1].EchoName + "-------> " + MyEchos[MyEchos.length - 1].EchoSpeak);
                        Adapter.createChannelAsync("Settings.Echos", "Settings.Echos");
                        Adapter.setObjectNotExistsAsync("Settings.Echos", {
                            type: "channel",
                            common: {
                                name: "Echos",
                                write: false
                            },
                            native: {}
                        });
                        Adapter.setObjectNotExistsAsync("Settings.Echos." + MyEchos[MyEchos.length - 1].EchoName, {
                            type: "state",
                            common: {
                                name: MyEchos[MyEchos.length - 1].EchoName,
                                desc: MyEchos[MyEchos.length - 1].EchoId,
                                type: 'string',
                                role: 'text',
                                write: false
                            },
                            native: {}
                        });
                        Adapter.setStateAsync("Settings.Echos." + MyEchos[MyEchos.length - 1].EchoName, MyEchos[MyEchos.length - 1].EchoSpeak, true);
                    });
                }
            });
        }
        async SplitSpeak(strParent, StringtoSpeach) {
            const Adapter = this;
            var strParent = "" + strParent;
            var fullArray = [];
            if (strParent !== undefined) {
                if (strParent.indexOf(',') == -1) {
                    fullArray.push(strParent);
                } else {
                    fullArray = strParent.split(',');
                }
            }
            //~ return fullArray;
            for (let iEcho in fullArray) {
                var NowEcho = await Adapter.getStateAsync('Settings.Echos.' + fullArray[iEcho]);
                if (NowEcho !== undefined) {
                    Adapter.log.info(strParent + " ==> Speak --> " + StringtoSpeach);
                    await Adapter.setForeignStateAsync(NowEcho.val, StringtoSpeach);
                }
            }
        }
        trigerSpeak(strSpeakArray, strSpeakIndex) {
                const Adapter = this;
                if (strSpeakArray[strSpeakIndex].EntranceState) {
                    Adapter.CheckAlarmState();
                }
                Adapter.log.info(strSpeakArray[strSpeakIndex].DeviceIDName + " ==> Speak ==> " + strSpeakArray[strSpeakIndex].Echos);
                switch (CommandSPTG.AlarmObject.toString()) {
                    case "2":
                    case "3":
                        if (strSpeakArray[strSpeakIndex].Speach) {
                            Adapter.SplitSpeak(strSpeakArray[strSpeakIndex].Echos, strSpeakArray[strSpeakIndex].SpeachString);
                        }
                        break;
                    case "1":
                        if (strSpeakArray[strSpeakIndex].EntranceState) {
                            if (strSpeakArray[strSpeakIndex].Speach) {
                                Adapter.SplitSpeak(strSpeakArray[strSpeakIndex].Echos, strSpeakArray[strSpeakIndex].SpeachString);
                            }
                        }
                        break;
                }
            }
            //**********************************************************************************************************************************************************
            //*************************************************************************Helper***************************************************************************
            //**********************************************************************************************************************************************************
        inTime(istartTime, iendTime, strDayArray) {
            var now = new Date();
            var timeHour = now.getHours();
            var timeMinutes = now.getMinutes()
            if (strDayArray[now.getDay()] == 1) {
                var StrTime = istartTime.split(':');
                var start = (Number(StrTime[0]) * 60) + Number(StrTime[1]);
                var EndTime = iendTime.split(':');
                var end = (Number(EndTime[0]) * 60) + Number(EndTime[1]);
                if (Number(EndTime[0]) < Number(StrTime[0]) && timeHour < Number(StrTime[0])) {
                    start -= (24 * 60);
                } else if (Number(StrTime[0]) > Number(EndTime[0])) {
                    end += (24 * 60);
                }
                var time = (timeHour * 60) + timeMinutes;
                this.log.info("compare now is " + timeHour + ":" + timeMinutes + "(" + time + ") Start is " + istartTime + " (" + start + ") End is " + iendTime + " (" + end + ")");
                return time >= start && time < end;
            } else {
                return false;
            }
        }
        getDayWeek(strGetDay) {
            var RetDayW = [0, 0, 0, 0, 0, 0, 0];
            if (strGetDay.Schedule_Sunday) {
                RetDayW[0] = 1;
            }
            if (strGetDay.Schedule_Monday) {
                RetDayW[1] = 1;
            }
            if (strGetDay.Schedule_Tuesday) {
                RetDayW[2] = 1;
            }
            if (strGetDay.Schedule_Wednesday) {
                RetDayW[3] = 1;
            }
            if (strGetDay.Schedule_Thursday) {
                RetDayW[4] = 1;
            }
            if (strGetDay.Schedule_Friday) {
                RetDayW[5] = 1;
            }
            if (strGetDay.Schedule_Saturday) {
                RetDayW[6] = 1;
            }
            return RetDayW;
        }
        gettimebetween(FromDate) {
            var RetDiff = '';
            if (FromDate !== undefined) {
                var iGDate = new Date();
                var TempSpliDate = FromDate.toString().split(' ')[1].replace(/(\d+)-(\S+)-(\d+)/, '$2 $1 $3');
                var TempDate = iGDate.toString().replace(/\S+\s(\S+)\s(\d+)\s(\d+)/, TempSpliDate);
                var SplitDate = FromDate.toString().split(' ')[0];
                var IGDif = TempDate.replace(/(\d{2}):(\d{2}):(\d{2})/, SplitDate);
                var SecFrom = new Date(IGDif).getTime();
                var SecTo = new Date().getTime();
                RetDiff = ((SecTo - SecFrom) / 1000).toFixed(0);
            }
            return RetDiff;
        }
        gettimediff(datetime) {
            var tempnow = Date();
            var pattern = /(\d{2})\:(\d{2})\:(\d{2})/;
            var convertednow = tempnow.replace(pattern, "" + datetime);
            var convertednowSec = new Date(convertednow).getTime();
            var nowtemp = new Date();
            var now = nowtemp.getTime();
            if (isNaN(convertednowSec)) {
                return "";
            }
            //~ if (convertednowSec < now) {
            //~ var milisec_diff = (convertednowSec + (24 * 60 * 60 * 1000)) - now;
            //~ } else {
            //~ var milisec_diff = convertednowSec - now;
            //~ }
            var milisec_diff = now - convertednowSec;
            var date_diff = (milisec_diff / 1000).toFixed(0);
            return date_diff;
        }
        convertseconds(totalSeconds) {
            var hours = Math.floor(totalSeconds / 3600);
            var minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
            var seconds = (totalSeconds - (hours * 3600) - (minutes * 60)).toFixed(0);
            var result = (hours < 10 ? "0" + hours : hours);
            result += ":" + (minutes < 10 ? "0" + minutes : minutes);
            result += ":" + (seconds < 10 ? "0" + seconds : seconds);
            return result;
        }
        convertTimeToseconds(ValTimeString) {
            if (ValTimeString == undefined) {
                return 0;
            }
            ValTimeString = ValTimeString.toString();
            var strTimeString = ValTimeString.split(':');
            if (ValTimeString.indexOf(':') == -1) {
                return 0;
            }
            return (Number(strTimeString[0]) * 3600) + (Number(strTimeString[1] * 60)) + Number(strTimeString[2]);
        }
        convertsecondsString(totalSeconds) {
            var hours = Math.floor(totalSeconds / 3600);
            var minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
            var seconds = (totalSeconds - (hours * 3600) - (minutes * 60)).toFixed(0);
            var result = '';
            if (hours === 1) {
                result += hours + Hourand[Mylanguage];
            } else if (hours > 1) {
                result += hours + Hoursand[Mylanguage];
            }
            if (minutes === 1) {
                result += minutes + Minuteand[Mylanguage];
            } else if (minutes > 1) {
                result += minutes + Minutesand[Mylanguage];
            }
            if (seconds === 1) {
                result += seconds + Second[Mylanguage];
            } else if (seconds > 1) {
                result += seconds + Seconds[Mylanguage];
            }
            return result;
        }
        getMyTime() {
            const Adapter = this;
            var MyTnow = new Date();
            var MyThour = MyTnow.getHours();
            var MyTminute = MyTnow.getMinutes();
            //~ var MyTsecond = MyTnow.getSeconds();
            MyThour = Adapter.pad2number(MyThour);
            MyTminute = Adapter.pad2number(MyTminute);
            //~ MyTsecond = Adapter.pad2number(MyTsecond);
            var MyLocalTime = MyThour + ':' + MyTminute; // + ':' + MyTsecond;
            return MyLocalTime;
        }
        pad2number(number) {
            number = (number < 10 ? '0' : '') + number;
            number = number.substring(0, 2);
            return number;
        }
        checkTrigger(strParent) {
                var strParent = "" + strParent;
                var fullArray = [];
                if (strParent !== undefined) {
                    if (strParent.indexOf(',') == -1) {
                        fullArray.push(strParent);
                    } else {
                        fullArray = strParent.split(',');
                    }
                }
                return fullArray;
            }
            //**********************************************************************************************************************************************************
            //*************************************************************************Motion***************************************************************************
            //**********************************************************************************************************************************************************
        Checkillumination(strVal, strObj) {
                strVal.trim()
                var Compareevent = strVal.match(/=|<|>/);
                var strnumber = strVal.match(/-*[0-9]+/);
                let inLUXRange = '';
                return new Promise(async(resolve, reject) => {
                    try {
                        var obj = await this.getForeignStateAsync(strObj);
                        if (obj) {
                            var IllVal = obj.val;
                            var iGetnumber = new Number(IllVal).valueOf();
                            var iSetnumber = new Number(strnumber).valueOf();
                            switch (Compareevent.toString()) {
                                case "=":
                                    if (iGetnumber == iSetnumber) {
                                        inLUXRange = true;
                                        this.log.info("Measured lux " + iGetnumber + " == Threshold of " + iSetnumber + ", therefore switched on.");
                                    } else {
                                        inLUXRange = false;
                                        this.log.info("Measured lux " + iGetnumber + " == Threshold of " + iSetnumber + ", therefore is not switched.");
                                    }
                                    break;
                                case "<":
                                    if (iGetnumber < iSetnumber) {
                                        inLUXRange = true;
                                        this.log.info("Measured lux " + iGetnumber + " < Threshold of " + iSetnumber + ", therefore switched on.");
                                    } else {
                                        inLUXRange = false;
                                        this.log.info("Measured lux " + iGetnumber + " < Threshold of " + iSetnumber + ", therefore is not switched.");
                                    }
                                    break;
                                case ">":
                                    if (iGetnumber > iSetnumber) {
                                        inLUXRange = true;
                                        this.log.info("Measured lux " + iGetnumber + " > Threshold of " + iSetnumber + ", therefore switched on.");
                                    } else {
                                        inLUXRange = false;
                                        this.log.info("Measured lux " + iGetnumber + " > Threshold of " + iSetnumber + ", therefore is not switched.");
                                    }
                                    break;
                            }
                        }
                        resolve(inLUXRange);
                    } catch (error) {
                        this.log.error(error.stack);
                        resolve(false);
                    }
                });
            }
            //**********************************************************************************************************************************************************
            //***************************************************************************Reed***************************************************************************
            //**********************************************************************************************************************************************************
        StartReedTimer(duration, strSpeakArray, strSpeakIndex) {
            const Adapter = this;
            var timer = duration,
                minutes, seconds;
            var CountdownIndex = [strSpeakArray[strSpeakIndex].DeviceType + "-" + strSpeakArray[strSpeakIndex].DeviceIDName];
            //****************************************Create Countdown*************************************************
            if (Reedcountdown[CountdownIndex] === undefined) {
                Reedcountdown.push(CountdownIndex);
                ReedTimestamp.push(CountdownIndex);
                const iCdate = new Date();
                const ICtime = iCdate.toTimeString().split(' ')[0].split(':');
                ReedTimestamp[CountdownIndex] = ICtime[0] + ':' + ICtime[1] + ':' + ICtime[2];
                //~ Adapter.setObjectNotExistsAsync(strSpeakArray[strSpeakIndex].DeviceType + "." + strSpeakArray[strSpeakIndex].DeviceIDName + ".History", {
                //~ type: "state",
                //~ common: {
                //~ name: 'History',
                //~ desc: 'History',
                //~ type: 'string',
                //~ role: 'text',
                //~ write: false
                //~ },
                //~ native: {}
                //~ });
                //~ Adapter.setStateAsync(strSpeakArray[strSpeakIndex].DeviceType + "." + strSpeakArray[strSpeakIndex].DeviceIDName + ".History", ICtime[0] + ':' + ICtime[1] + ':' + ICtime[2], true);
            }
            //****************************************Clear Countdown*************************************************
            if (Reedcountdown[CountdownIndex]) {
                clearTimeout(Reedcountdown[CountdownIndex]);
                Reedcountdown[CountdownIndex] = null;
                const iCdate = new Date();
                const ICtime = iCdate.toTimeString().split(' ')[0].split(':');
                ReedTimestamp[CountdownIndex] = ICtime[0] + ':' + ICtime[1] + ':' + ICtime[2];
            }
            Reedcountdown[CountdownIndex] = setInterval(function() {
                Adapter.setObjectNotExistsAsync(strSpeakArray[strSpeakIndex].DeviceType + "." + strSpeakArray[strSpeakIndex].DeviceIDName + ".countdown", {
                    type: "state",
                    common: {
                        name: 'countdown',
                        desc: 'countdown',
                        type: 'string',
                        role: 'text',
                        write: false
                    },
                    native: {}
                });
                var GetDiff = Adapter.gettimediff(ReedTimestamp[CountdownIndex]);
                Adapter.setStateAsync(strSpeakArray[strSpeakIndex].DeviceType + "." + strSpeakArray[strSpeakIndex].DeviceIDName + ".countdown", GetDiff, true);
                if (GetDiff.endsWith("0") && (GetDiff > duration)) {
                    if (strSpeakArray[strSpeakIndex].Speach) {
                        var SecConvertString = Adapter.convertsecondsString(GetDiff);
                        if (CommandSPTG.SendAlarmChanges) {
                            Adapter.setForeignStateAsync(CommandSPTG.TelegramObject, "⛔ 🚪 " + CommandSPTG.WarningphraseEntrance.toString() + ' ' + SecConvertString + " 🚪 ⛔");
                        }
                        if (CommandSPTG.AlarmVoice) {
                            Adapter.SplitSpeak(strSpeakArray[strSpeakIndex].Echos, CommandSPTG.WarningphraseEntrance.toString() + ' ' + SecConvertString);
                        }
                        Adapter.log.info(strSpeakArray[strSpeakIndex].DeviceIDName + " ===>:" + ReedTimestamp[CountdownIndex] + " / " + SecConvertString + " " + strSpeakArray[strSpeakIndex].SpeachString);
                    }
                }
                if (--timer < 0) {
                    timer = duration;
                }
            }, 1000);
        }
        GetEntrance(strAdapterarray, strArrayDev) {
            const Adapter = this;
            if (strAdapterarray[strArrayDev].EntranceState) {
                var iCdate = new Date();
                var ICdate = iCdate.toString().replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/, '$2-$1-$3');
                var ICtime = iCdate.toTimeString().split(' ')[0];
                for (let ifa in GlobalFamArray[0]) {
                    Adapter.setStateAsync("Family." + GlobalFamArray[0][ifa].IDName + ".Entrance", ICtime + " " + ICdate, true);
                }
                //============================Reset PresentGhost
                PresentGhost = false;
            }
        }
        trigerReed(strAdapterarray, strArrayDev) {
                const Adapter = this;
                //***********************************************************Register Reed Countdown****************************
                var iduration = parseInt(Adapter.convertTimeToseconds(strAdapterarray[strArrayDev].ReedCountdownValue))
                if (iduration > 0) {
                    Adapter.StartReedTimer(iduration, strAdapterarray, strArrayDev);
                }
                //***********************************************************Reed***********************************************
                for (let ArrayReed in strAdapterarray) {
                    //================Check Device List
                    var FindAllTriger = Adapter.checkTrigger(strAdapterarray[ArrayReed].trigerswitch);
                    var iFA;
                    for (iFA = 0; iFA < FindAllTriger.length; iFA++) {
                        //if (strAdapterarray[ArrayReed].trigerswitch == strAdapterarray[strArrayDev].DeviceType + "-" + strAdapterarray[strArrayDev].DeviceIDName) {
                        if (FindAllTriger[iFA].toString() == strAdapterarray[strArrayDev].DeviceType + "-" + strAdapterarray[strArrayDev].DeviceIDName) {
                            Adapter.log.info("==> " + iFA + "/" + FindAllTriger.length + " / " + FindAllTriger[iFA] + " = " + strAdapterarray[strArrayDev].DeviceType + "-" + strAdapterarray[strArrayDev].DeviceIDName);
                            var GetAlarm = Adapter.CheckAlarmState(strAdapterarray[ArrayReed].AlarmNumber);
                            if (GetAlarm) {
                                var TimeReedIndex = [strAdapterarray[ArrayReed].DeviceType + "-" + strAdapterarray[ArrayReed].DeviceIDName + "-" + strAdapterarray[strArrayDev].DeviceType + "-" + strAdapterarray[strArrayDev].DeviceIDName];
                                if (TimerReed[TimeReedIndex] === undefined) {
                                    TimerReed.push(TimeReedIndex);
                                }
                                if (TimerReed[TimeReedIndex]) {
                                    clearTimeout(TimerReed[TimeReedIndex]);
                                    TimerReed[TimeReedIndex] = null;
                                }
                                var ConvertReedTimeValue = strAdapterarray[strArrayDev].ReedTimeValue;
                                var ConvertedReedTimeValue = Adapter.convertTimeToseconds(ConvertReedTimeValue)
                                TimerReed[TimeReedIndex] = setTimeout(function() {
                                    TimerReed[TimeReedIndex] = null;
                                    //================Check State (Device)
                                    if (strAdapterarray[ArrayReed].activate) {
                                        //================Check Schedule Time and Day (Device)
                                        var DevRetDay = Adapter.getDayWeek(strAdapterarray[ArrayReed]);
                                        if (Adapter.inTime(strAdapterarray[ArrayReed].Schedule_Start, strAdapterarray[ArrayReed].Schedule_End, DevRetDay)) {
                                            //Adapter.log.info("defined times: " + strAdapterarray[ArrayReed].Schedule_Start + "-" + strAdapterarray[ArrayReed].Schedule_End + " Week Days: " + DevRetDay);
                                            if (strAdapterarray[ArrayReed].OnState) {
                                                var StringToCommandon = strAdapterarray[ArrayReed].OnObjectString;
                                                var ObjectToCommandon = strAdapterarray[ArrayReed].OnObject;
                                                var StringToCommandoff = strAdapterarray[ArrayReed].OffObjectString;
                                                var ObjectToCommandoff = strAdapterarray[ArrayReed].OffObject;
                                            } else {
                                                var StringToCommandon = strAdapterarray[ArrayReed].OffObjectString;
                                                var ObjectToCommandon = strAdapterarray[ArrayReed].OffObject;
                                                var StringToCommandoff = strAdapterarray[ArrayReed].OnObjectString;
                                                var ObjectToCommandoff = strAdapterarray[ArrayReed].OnObject;
                                            }
                                            Adapter.log.info("Found Switch: " + ObjectToCommandon + " with: " + StringToCommandon);
                                            if (/^#[0-9A-F]{6}$/i.test(StringToCommandon)) { //Color
                                                Adapter.setForeignStateAsync(ObjectToCommandon, StringToCommandon);
                                            } else if ((/\d+/g.test(StringToCommandon)) || (/true/g.test(StringToCommandon)) || (/false/g.test(StringToCommandon))) { // State
                                                Adapter.setForeignStateAsync(ObjectToCommandon, eval(StringToCommandon));
                                            } else { // Other
                                                Adapter.setForeignStateAsync(ObjectToCommandon, StringToCommandon);
                                            }
                                        } else {
                                            // Adapter.log.info(strAdapterarray[strArrayDev].DeviceIDName + ": motion detected, defined times returns false!");
                                        }
                                    }
                                }, ConvertedReedTimeValue * 1000); // Timer setzen auf X Minuten
                            } else {
                                Adapter.log.info("Alarm returns incorrect settings! Alarm setting is " + strAdapterarray[ArrayReed].AlarmNumber + ", the current alarm is " + CommandSPTG.AlarmObject);
                            }
                        }
                    }
                }
            }
            //**********************************************************************************************************************************************************
            //***************************************************************************Other**************************************************************************
            //**********************************************************************************************************************************************************
        trigerOther(strAdapterarray, strArrayDev) {
            const Adapter = this;
            for (let ArrayOther in strAdapterarray) {
                //================Check Device List
                var FindAllTriger = Adapter.checkTrigger(strAdapterarray[ArrayOther].trigerswitch);
                var iFA;
                for (iFA = 0; iFA < FindAllTriger.length; iFA++) {
                    if (FindAllTriger[iFA].toString() == strAdapterarray[strArrayDev].DeviceType + "-" + strAdapterarray[strArrayDev].DeviceIDName) {
                        Adapter.log.info("==> " + iFA + "/" + FindAllTriger.length + " / " + FindAllTriger[iFA] + " = " + strAdapterarray[strArrayDev].DeviceType + "-" + strAdapterarray[strArrayDev].DeviceIDName);
                        var GetAlarm = Adapter.CheckAlarmState(strAdapterarray[ArrayOther].AlarmNumber);
                        if (GetAlarm) {
                            var TimeOtherIndex = [strAdapterarray[ArrayOther].DeviceType + "-" + strAdapterarray[ArrayOther].DeviceIDName + "-" + strAdapterarray[strArrayDev].DeviceType + "-" + strAdapterarray[strArrayDev].DeviceIDName];
                            if (TimerOther[TimeOtherIndex] === undefined) {
                                TimerOther.push(TimeOtherIndex);
                            }
                            if (TimerOther[TimeOtherIndex]) {
                                clearTimeout(TimerOther[TimeOtherIndex]);
                                TimerOther[TimeOtherIndex] = null;
                            }
                            var ConvertOtherTimeValue = strAdapterarray[strArrayDev].OtherTimeValue;
                            var ConvertedOtherTimeValue = Adapter.convertTimeToseconds(ConvertOtherTimeValue)
                            Adapter.log.info(' Converted Time ' + strAdapterarray[strArrayDev].DeviceIDName + ' ' + ConvertedOtherTimeValue);
                            TimerOther[TimeOtherIndex] = setTimeout(function() {
                                TimerOther[TimeOtherIndex] = null;
                                //================Check State (Device)
                                if (strAdapterarray[ArrayOther].activate) {
                                    //================Check Schedule Time and Day (Device)
                                    var DevRetDay = Adapter.getDayWeek(strAdapterarray[ArrayOther]);
                                    if (Adapter.inTime(strAdapterarray[ArrayOther].Schedule_Start, strAdapterarray[ArrayOther].Schedule_End, DevRetDay)) {
                                        //***********************************************************Other Countdown****************************
                                        var idurationOther = parseInt(Adapter.convertTimeToseconds(strAdapterarray[strArrayDev].OtherCountdownValue))
                                        if (idurationOther > 0) {
                                            Adapter.startOtherTimer(idurationOther, strAdapterarray, strArrayDev, ArrayOther);
                                        }
                                        var ObjectToCommandon = strAdapterarray[ArrayOther].OnObject;
                                        var StringToCommandon = strAdapterarray[ArrayOther].OnObjectString;
                                        var ExecutorObjct = strAdapterarray[strArrayDev].OtherObjec,
                                            ExecutorObjctVal = strAdapterarray[strArrayDev].OtherObjectValue;
                                        if (((ExecutorObjct !== ObjectToCommandon) && (ExecutorObjctVal !== StringToCommandon)) || ((ExecutorObjct == ObjectToCommandon) && (ExecutorObjctVal !== StringToCommandon))) {
                                            Adapter.log.info("Found Switch: " + ObjectToCommandon + " with: " + StringToCommandon);
                                            if (/^#[0-9A-F]{6}$/i.test(StringToCommandon)) { //Color
                                                Adapter.setForeignStateAsync(ObjectToCommandon, StringToCommandon);
                                            } else if ((/\d+/g.test(StringToCommandon)) || (/true/g.test(StringToCommandon)) || (/false/g.test(StringToCommandon))) { // State
                                                Adapter.setForeignStateAsync(ObjectToCommandon, eval(StringToCommandon));
                                            } else { // Other
                                                Adapter.setForeignStateAsync(ObjectToCommandon, StringToCommandon);
                                            }
                                        } else {
                                            Adapter.log.error('1: ' + strAdapterarray[strArrayDev].DeviceIDName + ' = ' + ExecutorObjctVal + ' and ' + strAdapterarray[ArrayOther].DeviceIDName + ' = ' + StringToCommandon + ' have the same settings! the infinite loop must be skipped!');
                                        }
                                        if (CommandSPTG.AlarmVoice) {
                                            if (strAdapterarray[ArrayOther].Speach) {
                                                Adapter.SplitSpeak(strAdapterarray[ArrayOther].Echos, strAdapterarray[ArrayOther].SpeachString);
                                            }
                                        }
                                    } else {
                                        // Adapter.log.info(strAdapterarray[strArrayDev].DeviceIDName + ": Other detected, defined times returns false!");
                                    }
                                }
                            }, ConvertedOtherTimeValue * 1000); // Timer setzen auf X Minuten
                        } else {
                            Adapter.log.info("Alarm returns incorrect settings! Alarm setting is " + strAdapterarray[ArrayOther].AlarmNumber + ", the current alarm is " + CommandSPTG.AlarmObject);
                        }
                    }
                }
            }
        }
        startOtherTimer(duration, strOtherArray, strOtherIndex, strOtherDevIndex) {
            const Adapter = this;
            var timer = duration,
                minutes, seconds;
            var CountdownIndex = [strOtherArray[strOtherIndex].DeviceType + "-" + strOtherArray[strOtherIndex].DeviceIDName];
            //****************************************Create Countdown*************************************************
            if (Othercountdown[CountdownIndex] === undefined) {
                Othercountdown.push(CountdownIndex);
                OtherTimestamp.push(CountdownIndex);
                const iCdate = new Date();
                const ICtime = iCdate.toTimeString().split(' ')[0].split(':');
                OtherTimestamp[CountdownIndex] = ICtime[0] + ':' + ICtime[1] + ':' + ICtime[2];
            }
            //****************************************Clear Countdown*************************************************
            if (Othercountdown[CountdownIndex]) {
                clearTimeout(Othercountdown[CountdownIndex]);
                Othercountdown[CountdownIndex] = null;
                const iCdate = new Date();
                const ICtime = iCdate.toTimeString().split(' ')[0].split(':');
                OtherTimestamp[CountdownIndex] = ICtime[0] + ':' + ICtime[1] + ':' + ICtime[2];
            }
            Othercountdown[CountdownIndex] = setInterval(function() {
                Adapter.setObjectNotExistsAsync(strOtherArray[strOtherIndex].DeviceType + "." + strOtherArray[strOtherIndex].DeviceIDName + ".countdown", {
                    type: "state",
                    common: {
                        name: 'countdown',
                        desc: 'countdown',
                        type: 'string',
                        role: 'text',
                        write: false
                    },
                    native: {}
                });
                var GetDiff = Adapter.gettimediff(OtherTimestamp[CountdownIndex]);
                Adapter.setStateAsync(strOtherArray[strOtherIndex].DeviceType + "." + strOtherArray[strOtherIndex].DeviceIDName + ".countdown", GetDiff, true);
                if (--timer < 0) {
                    var SecConvertString = Adapter.convertsecondsString(GetDiff);
                    Adapter.log.info(strOtherArray[strOtherIndex].DeviceIDName + " ===>:" + OtherTimestamp[CountdownIndex] + " / " + SecConvertString + " " + strOtherArray[strOtherIndex].SpeachString);
                    if (strOtherArray[strOtherDevIndex].OnState) {
                        var StringToCommandon = strOtherArray[strOtherDevIndex].OnObjectString;
                        var ObjectToCommandon = strOtherArray[strOtherDevIndex].OnObject;
                        var StringToCommandoff = strOtherArray[strOtherDevIndex].OffObjectString;
                        var ObjectToCommandoff = strOtherArray[strOtherDevIndex].OffObject;
                    } else {
                        var StringToCommandon = strOtherArray[strOtherDevIndex].OffObjectString;
                        var ObjectToCommandon = strOtherArray[strOtherDevIndex].OffObject;
                        var StringToCommandoff = strOtherArray[strOtherDevIndex].OnObjectString;
                        var ObjectToCommandoff = strOtherArray[strOtherDevIndex].OnObject;
                    }
                    Adapter.log.info("Found Switch: " + ObjectToCommandon + " with: " + StringToCommandon);
                    var ExecutorObjct = strOtherArray[strOtherIndex].OtherObjec,
                        ExecutorObjctVal = strOtherArray[strOtherIndex].OtherObjectValue;
                    if (((ExecutorObjct !== ObjectToCommandon) && (ExecutorObjctVal !== StringToCommandon)) || ((ExecutorObjct == ObjectToCommandon) && (ExecutorObjctVal !== StringToCommandon))) {
                        if (/^#[0-9A-F]{6}$/i.test(StringToCommandon)) { //Color
                            Adapter.setForeignStateAsync(ObjectToCommandon, StringToCommandon);
                        } else if ((/\d+/g.test(StringToCommandon)) || (/true/g.test(StringToCommandon)) || (/false/g.test(StringToCommandon))) { // State
                            Adapter.setForeignStateAsync(ObjectToCommandon, eval(StringToCommandon));
                        } else { // Other
                            Adapter.setForeignStateAsync(ObjectToCommandon, StringToCommandon);
                        }
                    } else {
                        Adapter.log.error('2: ' + strOtherArray[strOtherIndex].DeviceIDName + ' = ' + ExecutorObjctVal + ' and ' + strOtherArray[strOtherDevIndex].DeviceIDName + ' = ' + StringToCommandon + ' have the same settings! the infinite loop must be skipped!');
                    }
                    if (CommandSPTG.AlarmVoice) {
                        if (strOtherArray[strOtherDevIndex].Speach) {
                            Adapter.SplitSpeak(strOtherArray[strOtherDevIndex].Echos, strOtherArray[strOtherDevIndex].SpeachString);
                        }
                    }
                    Adapter.log.warn(strOtherArray[strOtherDevIndex].DeviceIDName + " ===>:" + OtherTimestamp[CountdownIndex] + " / " + SecConvertString + " " + strOtherArray[strOtherIndex].SpeachString);
                    //~ Adapter.setForeignStateAsync(strOtherArray[strOtherDevIndex].OffObject, strOtherArray[strOtherDevIndex].OffObjectString);
                    clearTimeout(Othercountdown[CountdownIndex]);
                }
            }, 1000);
        }
        CheckOtherState(strVal, strObj) {
                strVal.trim()
                var Compareevent = strVal.match(/=|<|>/);
                var strnumber = strVal.match(/-*[0-9]+/);
                let OthRange = '';
                return new Promise(async(resolve, reject) => {
                    try {
                        var obj = await this.getForeignStateAsync(strObj);
                        if (obj) {
                            var OthVal = obj.val;
                            var iGetnumber = new Number(OthVal).valueOf();
                            var iSetnumber = new Number(strnumber).valueOf();
                            switch (Compareevent.toString()) {
                                case "=":
                                    if (iGetnumber == iSetnumber) {
                                        OthRange = true;
                                        this.log.info("Measured " + iGetnumber + " == Threshold of " + iSetnumber + ", therefore switched on.");
                                    } else {
                                        OthRange = false;
                                        this.log.info("Measured " + iGetnumber + " == Threshold of " + iSetnumber + ", therefore is not switched.");
                                    }
                                    break;
                                case "<":
                                    if (iGetnumber < iSetnumber) {
                                        OthRange = true;
                                        this.log.info("Measured " + iGetnumber + " < Threshold of " + iSetnumber + ", therefore switched on.");
                                    } else {
                                        OthRange = false;
                                        this.log.info("Measured " + iGetnumber + " < Threshold of " + iSetnumber + ", therefore is not switched.");
                                    }
                                    break;
                                case ">":
                                    if (iGetnumber > iSetnumber) {
                                        OthRange = true;
                                        this.log.info("Measured " + iGetnumber + " > Threshold of " + iSetnumber + ", therefore switched on.");
                                    } else {
                                        OthRange = false;
                                        this.log.info("Measured " + iGetnumber + " > Threshold of " + iSetnumber + ", therefore is not switched.");
                                    }
                                    break;
                            }
                        }
                        resolve(OthRange);
                    } catch (error) {
                        this.log.error(error.stack);
                        resolve(false);
                    }
                });
            }
            //**********************************************************************************************************************************************************
            //***********************************************************************Timer******************************************************************************
            //**********************************************************************************************************************************************************
        async checkTimerStart() {
                const Adapter = this;
                TimerTimer.forEach(async(TimeTimerIndex) => {
                    if (moment().isSame(moment(TimerTimer[TimeTimerIndex], "hh:mm:ss"), "second")) {
                        var SplitTimerName = TimeTimerIndex.toString().split('-');
                        Adapter.log.info("Timer detected " + moment() + " ==> " + SplitTimerName[1]);
                        if (SplitTimerName !== -1) {
                            Adapterarray = [];
                            var GetChangeObjectJson = await Adapter.getStateAsync('Change');
                            if (GetChangeObjectJson !== undefined) {
                                Adapterarray.push(JSON.parse(GetChangeObjectJson.val));
                                for (let ArrayDev in Adapterarray[0]) {
                                    //**************************************Start loop switch off***********************************************
                                    if (Adapterarray[0][ArrayDev].DeviceType == "Switch") {
                                        //================Check Device List
                                        var FindAllTriger = Adapter.checkTrigger(Adapterarray[0][ArrayDev].trigerswitch);
                                        var iFA;
                                        for (iFA = 0; iFA < FindAllTriger.length; iFA++) {
                                            if (FindAllTriger[iFA].toString() == TimeTimerIndex.toString()) {
                                                var timer = Adapter.convertTimeToseconds(Adapterarray[0][SplitTimerName[1]].TimerCountdownValue); //TimerTimeValue; //SplitTimerName[0],
                                                var timerTimeOut = Adapter.convertTimeToseconds(Adapterarray[0][SplitTimerName[1]].TimerTimeValue);
                                                setTimeout(function() {
                                                    Adapter.log.warn("Timer detected ==> Timeout" + timerTimeOut + " ==> Countdown" + timer + " ==> " + TimeTimerIndex.toString());
                                                    var CountdownIndex = [Adapterarray[0][ArrayDev].DeviceType + "-" + Adapterarray[0][ArrayDev].DeviceIDName + "-" + TimeTimerIndex];
                                                    //****************************************Create Countdown*************************************************
                                                    if (Timercountdown[CountdownIndex] === undefined) {
                                                        Timercountdown.push(CountdownIndex);
                                                        TimerTimestamp.push(CountdownIndex);
                                                        const iCdate = new Date();
                                                        const ICtime = iCdate.toTimeString().split(' ')[0].split(':');
                                                        TimerTimestamp[CountdownIndex] = ICtime[0] + ':' + ICtime[1] + ':' + ICtime[2];
                                                    }
                                                    //****************************************Clear Countdown*************************************************
                                                    if (Timercountdown[CountdownIndex]) {
                                                        clearTimeout(Timercountdown[CountdownIndex]);
                                                        Timercountdown[CountdownIndex] = null;
                                                        const iCdate = new Date();
                                                        const ICtime = iCdate.toTimeString().split(' ')[0].split(':');
                                                        TimerTimestamp[CountdownIndex] = ICtime[0] + ':' + ICtime[1] + ':' + ICtime[2];
                                                    }
                                                    if (Adapterarray[0][ArrayDev].OnState) {
                                                        var StringToCommandon = Adapterarray[0][ArrayDev].OnObjectString;
                                                        var ObjectToCommandon = Adapterarray[0][ArrayDev].OnObject;
                                                    } else {
                                                        var StringToCommandon = Adapterarray[0][ArrayDev].OffObjectString;
                                                        var ObjectToCommandon = Adapterarray[0][ArrayDev].OffObject;
                                                    }
                                                    Adapter.log.info("Found Switch: " + ObjectToCommandon + " with: " + StringToCommandon);
                                                    if (/^#[0-9A-F]{6}$/i.test(StringToCommandon)) { //Color
                                                        Adapter.setForeignStateAsync(ObjectToCommandon, StringToCommandon);
                                                    } else if ((/\d+/g.test(StringToCommandon)) || (/true/g.test(StringToCommandon)) || (/false/g.test(StringToCommandon))) { // State
                                                        Adapter.setForeignStateAsync(ObjectToCommandon, eval(StringToCommandon));
                                                    } else { // Other
                                                        Adapter.setForeignStateAsync(ObjectToCommandon, StringToCommandon);
                                                    }
                                                    if (CommandSPTG.AlarmVoice) {
                                                        if (Adapterarray[0][ArrayDev].Speach) {
                                                            Adapter.SplitSpeak(Adapterarray[0][ArrayDev].Echos, Adapterarray[0][ArrayDev].SpeachString);
                                                        }
                                                    }
                                                    Timercountdown[CountdownIndex] = setInterval(function() {
                                                        Adapter.setObjectNotExistsAsync(Adapterarray[0][ArrayDev].DeviceType + "." + Adapterarray[0][ArrayDev].DeviceIDName + ".countdown", {
                                                            type: "state",
                                                            common: {
                                                                name: 'countdown',
                                                                desc: 'countdown',
                                                                type: 'string',
                                                                role: 'text',
                                                                write: false
                                                            },
                                                            native: {}
                                                        });
                                                        var GetDiff = Adapter.gettimediff(TimerTimestamp[CountdownIndex]);
                                                        Adapter.setStateAsync(Adapterarray[0][ArrayDev].DeviceType + "." + Adapterarray[0][ArrayDev].DeviceIDName + ".countdown", GetDiff, true);
                                                        if (--timer < 0) {
                                                            var SecConvertString = Adapter.convertsecondsString(GetDiff);
                                                            Adapter.log.info(Adapterarray[0][ArrayDev].DeviceIDName + " ===>:" + TimerTimestamp[CountdownIndex] + " / " + SecConvertString + " " + Adapterarray[0][ArrayDev].SpeachString);
                                                            if (Adapterarray[0][ArrayDev].OnState) {
                                                                var StringToCommandoff = Adapterarray[0][ArrayDev].OffObjectString;
                                                                var ObjectToCommandoff = Adapterarray[0][ArrayDev].OffObject;
                                                            } else {
                                                                var StringToCommandoff = Adapterarray[0][ArrayDev].OnObjectString;
                                                                var ObjectToCommandoff = Adapterarray[0][ArrayDev].OnObject;
                                                            }
                                                            Adapter.log.info("Found Switch: " + ObjectToCommandoff + " with: " + StringToCommandoff);
                                                            if (/^#[0-9A-F]{6}$/i.test(StringToCommandoff)) { //Color
                                                                Adapter.setForeignStateAsync(ObjectToCommandoff, StringToCommandoff);
                                                            } else if ((/\d+/g.test(StringToCommandoff)) || (/true/g.test(StringToCommandoff)) || (/false/g.test(StringToCommandoff))) { // State
                                                                Adapter.setForeignStateAsync(ObjectToCommandoff, eval(StringToCommandoff));
                                                            } else { // Other
                                                                Adapter.setForeignStateAsync(ObjectToCommandoff, StringToCommandoff);
                                                            }
                                                            if (CommandSPTG.AlarmVoice) {
                                                                if (Adapterarray[0][ArrayDev].Speach) {
                                                                    Adapter.SplitSpeak(Adapterarray[0][ArrayDev].Echos, Adapterarray[0][ArrayDev].SpeachString);
                                                                }
                                                            }
                                                            Adapter.log.warn(Adapterarray[0][ArrayDev].DeviceIDName + " ===>:" + TimerTimestamp[CountdownIndex] + " / " + SecConvertString + " " + Adapterarray[0][ArrayDev].SpeachString);
                                                            clearTimeout(Timercountdown[CountdownIndex]);
                                                        }
                                                    }, 1000);
                                                }, timerTimeOut * 1000);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
            }
            //**********************************************************************************************************************************************************
            //**************************************************************************Switch**************************************************************************
            //**********************************************************************************************************************************************************
        triggerDevice(strAdapterarray, strArrayDev) {
                const Adapter = this;
                for (let ArraySwitch in strAdapterarray) {
                    //================Check Device List
                    var FindAllTriger = Adapter.checkTrigger(strAdapterarray[ArraySwitch].trigerswitch);
                    var iFA;
                    for (iFA = 0; iFA < FindAllTriger.length; iFA++) {
                        if (FindAllTriger[iFA] == strAdapterarray[strArrayDev].DeviceType + "-" + strAdapterarray[strArrayDev].DeviceIDName) {
                            Adapter.log.info("==> " + iFA + "/" + FindAllTriger.length + " / " + FindAllTriger[iFA] + " = " + strAdapterarray[strArrayDev].DeviceType + "-" + strAdapterarray[strArrayDev].DeviceIDName);
                            var GetAlarm = Adapter.CheckAlarmState(strAdapterarray[ArraySwitch].AlarmNumber);
                            if (GetAlarm) {
                                var TimeIndex = [strAdapterarray[ArraySwitch].DeviceType + "-" + strAdapterarray[ArraySwitch].DeviceIDName + "-" + strAdapterarray[strArrayDev].DeviceType + "-" + strAdapterarray[strArrayDev].DeviceIDName];
                                if (Timer[TimeIndex] === undefined) {
                                    Timer.push(TimeIndex);
                                }
                                if (Timer[TimeIndex]) {
                                    clearTimeout(Timer[TimeIndex]);
                                    Timer[TimeIndex] = null;
                                }
                                //================Check State (Device)
                                if (strAdapterarray[ArraySwitch].activate) {
                                    //================Check Schedule Time and Day (Device)
                                    var DevRetDay = Adapter.getDayWeek(strAdapterarray[ArraySwitch]);
                                    if (Adapter.inTime(strAdapterarray[ArraySwitch].Schedule_Start, strAdapterarray[ArraySwitch].Schedule_End, DevRetDay)) {
                                        Adapter.log.info("defined times: " + strAdapterarray[ArraySwitch].Schedule_Start + "-" + strAdapterarray[ArraySwitch].Schedule_End + " Week Days: " + DevRetDay);
                                        Adapter.trigerSpeak(strAdapterarray, ArraySwitch);
                                        if (strAdapterarray[ArraySwitch].OnState) {
                                            var StringToCommandon = strAdapterarray[ArraySwitch].OnObjectString;
                                            var ObjectToCommandon = strAdapterarray[ArraySwitch].OnObject;
                                            var StringToCommandoff = strAdapterarray[ArraySwitch].OffObjectString;
                                            var ObjectToCommandoff = strAdapterarray[ArraySwitch].OffObject;
                                        } else {
                                            var StringToCommandon = strAdapterarray[ArraySwitch].OffObjectString;
                                            var ObjectToCommandon = strAdapterarray[ArraySwitch].OffObject;
                                            var StringToCommandoff = strAdapterarray[ArraySwitch].OnObjectString;
                                            var ObjectToCommandoff = strAdapterarray[ArraySwitch].OnObject;
                                        }
                                        Adapter.log.info("FoundSwitch: " + ObjectToCommandon + " with: " + StringToCommandon);
                                        if (/^#[0-9A-F]{6}$/i.test(StringToCommandon)) {
                                            Adapter.setForeignStateAsync(ObjectToCommandon, StringToCommandon);
                                        } else {
                                            Adapter.setForeignStateAsync(ObjectToCommandon, eval(StringToCommandon));
                                        }
                                        Timer[TimeIndex] = setTimeout(function() {
                                            Timer[TimeIndex] = null;
                                            Adapter.log.info("FoundSwitch: " + ObjectToCommandoff + " with: " + StringToCommandoff);
                                            if (/^#[0-9A-F]{6}$/i.test(StringToCommandoff)) {
                                                Adapter.setForeignStateAsync(ObjectToCommandoff, StringToCommandoff); // Licht/Gerät aus nach Ablauf Timer
                                            } else {
                                                Adapter.setForeignStateAsync(ObjectToCommandoff, eval(StringToCommandoff)); // Licht/Gerät aus nach Ablauf Timer
                                            }
                                        }, strAdapterarray[strArrayDev].MotionTimeValue * 1000); // Timer setzen auf X Minuten
                                        Adapter.log.info(strAdapterarray[strArrayDev].DeviceIDName + ": motion detected, event is triggered for " + strAdapterarray[strArrayDev].MotionTimeValue + " seconds.");
                                    } else {
                                        Adapter.log.info(strAdapterarray[strArrayDev].DeviceIDName + ": motion detected, defined times returns false!");
                                    }
                                }
                            } else {
                                Adapter.log.info("Alarm returns incorrect settings! Alarm setting is " + strAdapterarray[ArraySwitch].AlarmNumber + ", the current alarm is " + CommandSPTG.AlarmObject);
                            }
                        }
                    }
                }
            }
            //**********************************************************************************************************************************************************
            //******************************************************************Clean***********************************************************************************
            //**********************************************************************************************************************************************************
        async Cleareverything() {
            const Adapter = this;
            TimerReed.forEach((TimeIndexName) => {
                try {
                    var TimeIndexVar = TimeIndexName.toString().split('-')
                    Adapter.CleareverySwitch(TimeIndexVar[0] + '-' + TimeIndexVar[1]);
                } catch (error) {
                    this.log.error(error.stack);
                }
            });
            Timer.forEach((TimeIndexName) => {
                try {
                    var TimeIndexVar = TimeIndexName.toString().split('-')
                    Adapter.CleareverySwitch(TimeIndexVar[2] + '-' + TimeIndexVar[3]);
                } catch (error) {
                    this.log.error(error.stack);
                }
            });
            TimerOther.forEach((TimeIndexName) => {
                try {
                    var TimeIndexVar = TimeIndexName.toString().split('-')
                    Adapter.CleareverySwitch(TimeIndexVar[2] + '-' + TimeIndexVar[3]);
                } catch (error) {
                    this.log.error(error.stack);
                }
            });
            Timercountdown.forEach((TimeIndexName) => {
                try {
                    var TimeIndexVar = TimeIndexName.toString().split('-')
                    Adapter.CleareverySwitch(TimeIndexVar[2] + '-' + TimeIndexVar[3]);
                } catch (error) {
                    this.log.error(error.stack);
                }
            });
        }
        async CleareverySwitch(ClearSWName) {
                const Adapter = this;
                Adapterarray = [];
                var GetChangeObjectJson = await Adapter.getStateAsync('Change');
                if (GetChangeObjectJson !== undefined) {
                    Adapterarray.push(JSON.parse(GetChangeObjectJson.val));
                    for (let ArrayDev in Adapterarray[0]) {
                        //**************************************Start loop switch off***********************************************
                        if (Adapterarray[0][ArrayDev].DeviceType == "Switch") {
                            //================Check Device List
                            var FindAllTriger = Adapter.checkTrigger(Adapterarray[0][ArrayDev].trigerswitch);
                            var iFA;
                            for (iFA = 0; iFA < FindAllTriger.length; iFA++) {
                                if (FindAllTriger[iFA].toString() == ClearSWName) {
                                    //================Check State
                                    if (Adapterarray[0][ArrayDev].activate) {
                                        var StringToCommandoff = Adapterarray[0][ArrayDev].OffObjectString;
                                        var ObjectToCommandoff = Adapterarray[0][ArrayDev].OffObject;
                                        Adapter.log.warn("clean " + Adapterarray[0][ArrayDev].DeviceType + "  " + Adapterarray[0][ArrayDev].DeviceIDName);
                                        if (/^#[0-9A-F]{6}$/i.test(StringToCommandoff)) { //Color
                                            Adapter.setForeignStateAsync(ObjectToCommandoff, StringToCommandoff);
                                        } else if ((/\d+/g.test(StringToCommandoff)) || (/true/g.test(StringToCommandoff)) || (/false/g.test(StringToCommandoff))) { // State
                                            Adapter.setForeignStateAsync(ObjectToCommandoff, eval(StringToCommandoff));
                                        } else { // Other
                                            Adapter.setForeignStateAsync(ObjectToCommandoff, StringToCommandoff);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            //**********************************************************************************************************************************************************
            //******************************************************************continuous trigger**********************************************************************
            //**********************************************************************************************************************************************************
        onUnload(callback) {
            try {
                this.log.info("cleaned everything up...");
                this.Cleareverything();
                callback();
            } catch (e) {
                callback();
            }
        }
        onObjectChange(id, obj) {
            if (obj) {
                // The object was changed
                this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
            } else {
                // The object was deleted
                this.log.info(`object ${id} deleted`);
            }
        }
        async onStateChange(id, state) {
                const Adapter = this;
                if (state) {
                    // The state was changed
                    if (id.indexOf(".Change") !== -1) {
                        Adapterarray = [];
                        Adapterarray.push(JSON.parse(state.val));
                    }
                    if (id.indexOf(".summary") !== -1) {
                        if (CommandSPTG.VoiceResetLevel.toString() == state.val) {
                            Adapter.setStateAsync('Settings.AlarmObject', '2', true);
                            PresentGhost = true;
                        }
                        if (CommandSPTG.VoiceChangeLevel) {
                            var SpokenCommand = state.val.toString();
                            var SetSpokenCommand = CommandSPTG.VoiceChangeLevel.toString()
                            if (SpokenCommand.startsWith(SetSpokenCommand)) {
                                var intNameVoiceLevel = SpokenCommand.replace(SetSpokenCommand, '').trim();
                                var intVoiceLevel = '';
                                if (intNameVoiceLevel == Levelzero[Mylanguage]) {
                                    intVoiceLevel = '0';
                                } else if (intNameVoiceLevel == Levelone[Mylanguage]) {
                                    intVoiceLevel = '1';
                                } else if (intNameVoiceLevel == Leveltwo[Mylanguage]) {
                                    intVoiceLevel = '2';
                                } else if (intNameVoiceLevel == Levelthree[Mylanguage]) {
                                    intVoiceLevel = '3';
                                }
                                //var intVoiceLevel = parseInt(SpokenCommand.match(/[0-3]+/));
                                if (intVoiceLevel !== '') {
                                    Adapter.setStateAsync('Settings.AlarmObject', '' + intVoiceLevel, true);
                                }
                            }
                        }
                    }
                    if (id.indexOf(".AlarmObject") !== -1) {
                        CommandSPTG.AlarmObject = state.val;
                        var SymbolAlarmSt = '⚠',
                            SymbolAlarmEn = '⚠',
                            SpeakLevel = '0';
                        switch (CommandSPTG.AlarmObject.toString()) {
                            case '0':
                                SymbolAlarmSt = '⚠🔓';
                                SymbolAlarmEn = '0 🔓⚠';
                                SpeakLevel = '0';
                                break;
                            case '1':
                                SymbolAlarmSt = '⚠🔐';
                                SymbolAlarmEn = '1 🔐⚠';
                                SpeakLevel = '1';
                                break;
                            case '2':
                                SymbolAlarmSt = '🔔🔒';
                                SymbolAlarmEn = '2 🔒🔔';
                                SpeakLevel = '2';
                                break;
                            case '3':
                                SymbolAlarmSt = '🚨🔒';
                                SymbolAlarmEn = '3 🔒🚨';
                                SpeakLevel = '3';
                                break;
                        }
                        if (PresentGhost) {
                            SymbolAlarmSt = 'ℹ️',
                                SymbolAlarmEn = '2ℹ️',
                                SpeakLevel = '2';
                        }
                        Adapter.log.warn(Alarmwaschangedfromlevel[Mylanguage] + CommandSPTG.OldAlarmObject + to[Mylanguage] + CommandSPTG.AlarmObject);
                        if (CommandSPTG.SendAlarmChanges) {
                            Adapter.setForeignStateAsync(CommandSPTG.TelegramObject, SymbolAlarmSt + Alarmwaschangedfromlevel[Mylanguage] + CommandSPTG.OldAlarmObject + to[Mylanguage] + SymbolAlarmEn); //✔ ✖✅🚪🔓🔒🔔⛊
                        }
                        if (CommandSPTG.AlarmVoice) {
                            Adapter.setForeignStateAsync(CommandSPTG.SpeakObject, Alarmwaschangedfromlevel[Mylanguage] + CommandSPTG.OldAlarmObject + to[Mylanguage] + SpeakLevel);
                        }
                        if ((SpeakLevel == '3') && !AlarmIsThree) {
                            AlarmIsThree = true;
                            await Adapter.GetFamilyPresentNumber();
                        } else {
                            AlarmIsThree = false;
                            //**************************************Reset loop switch off***********************************************
                            AlarmIsActivThree = false;
                            //**************************************Unsubscribe all switch**********************************************
                            for (let ArrayDev in Adapterarray[0]) {
                                if (Adapterarray[0][ArrayDev].DeviceType == "Switch") {
                                    Adapter.unsubscribeForeignStates(Adapterarray[0][ArrayDev].OnObject);
                                    Adapter.unsubscribeForeignStates(Adapterarray[0][ArrayDev].OffObject);
                                }
                            }
                        }
                        CommandSPTG.OldAlarmObject = state.val;
                        Adapter.setStateAsync('Settings.OldAlarmObject', state.val, true);
                    }
                    if (id.indexOf(".SendAlarmChanges") !== -1) {
                        CommandSPTG.SendAlarmChanges = state.val;
                    }
                    if (id.indexOf(".AlarmVoice") !== -1) {
                        CommandSPTG.AlarmVoice = state.val;
                    }
                    if (id.indexOf(".AlarmCountdownValue") !== -1) {
                        CommandSPTG.AlarmCountdownValue = state.val;
                    }
                    if (id.indexOf(".Welcomephrase") !== -1) {
                        CommandSPTG.Welcomephrase = state.val;
                    }
                    if (id.indexOf(".WarningphraseEntrance") !== -1) {
                        CommandSPTG.WarningphraseEntrance = state.val;
                    }
                    if (id.indexOf(".WarningphraseMotion") !== -1) {
                        CommandSPTG.WarningphraseMotion = state.val;
                    }
                    if (id.indexOf(".VoiceResetLevel") !== -1) {
                        CommandSPTG.VoiceResetLevel = state.val;
                    }
                    if (id.indexOf(".VoiceChangeLevel") !== -1) {
                        CommandSPTG.VoiceChangeLevel = state.val;
                    }
                    if (!id.endsWith("countdown")) {
                        //**************************************if any change Start loop switch off***********************************************
                        var WarnToSendString = '🚨 ' + Thealarmsystemissettolevel[Mylanguage] + '\n',
                            retWarnToSendString = '\n';
                        if (AlarmIsActivThree) {
                            if (Math.floor((Date.now() - SubsLevelThreeTimer) / 1000) > 5) {
                                for (let ArrayDev in Adapterarray[0]) {
                                    if (Adapterarray[0][ArrayDev].OnObject == id) {
                                        var WarnToSendState = '';
                                        if (state.val) {
                                            WarnToSendState = switchedon[Mylanguage];
                                        } else {
                                            WarnToSendState = switchedoff[Mylanguage];
                                        }
                                        WarnToSendString += '◉ ' + Adapterarray[0][ArrayDev].DeviceIDName + ' ➢ ' + statechanged[Mylanguage] + ' ➢ ' + WarnToSendState + '\n';
                                        Adapter.log.warn("The alarm system is set to 3 : 🚨 state " + Adapterarray[0][ArrayDev].DeviceIDName + " changed: " + state.val);
                                        AlarmIsActivThree = false;
                                        var retWarnToSendString = await Adapter.StartLevelThree(false);
                                    }
                                }
                                WarnToSendString += retWarnToSendString;
                                if (CommandSPTG.SendAlarmChanges) {
                                    Adapter.setForeignStateAsync(CommandSPTG.TelegramObject, WarnToSendString);
                                }
                            } else {
                                SubsLevelThreeTimer = Date.now();
                            }
                            //~ this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
                        }
                    }
                    for (let ArrayFaml in GlobalFamArray[0]) {
                        //~ IDName: IDName.val,
                        //~ PresenceObject: PresenceObject.val,
                        //~ PresenceTime: PresenceTime.val,
                        //~ PresenceStamp: PresenceStamp.val,
                        //~ PresenceState: PresenceState.val,
                        //~ AbsentSince: AbsentSince.val,
                        //~ Active: Active.val
                        if (id == GlobalFamArray[0][ArrayFaml].PresenceObject) {
                            var GetLastEntrance = await Adapter.getStateAsync("Family." + GlobalFamArray[0][ArrayFaml].IDName + ".Entrance");
                            var TimeEntrance = Adapter.gettimebetween(GetLastEntrance.val);
                            Adapter.log.info("The entrance was last opened " + TimeEntrance + " seconds ago. => " + Adapter.convertseconds(TimeEntrance));
                            Adapter.log.info(GlobalFamArray[0][ArrayFaml].IDName + " was changed from state " + !state.val + " to " + state.val);
                            if (TimeEntrance < (10 * 60)) {
                                var Famduration = GlobalFamArray[0][ArrayFaml].PresenceTime;
                                Adapter.CheckFamilyState(parseInt(Famduration), GlobalFamArray[0], ArrayFaml, state.val)
                            } else {
                                //*****************************Fix Presence Check => when the device goes offline even though the entrance door was closed.
                                var GetLastFamilyState = await Adapter.getStateAsync("Family." + GlobalFamArray[0][ArrayFaml].IDName + ".PresenceState");
                                if ((!GetLastFamilyState.val) && state.val) {
                                    Adapter.setStateAsync("Family." + GlobalFamArray[0][ArrayFaml].IDName + ".PresenceState", true, true);
                                    Adapter.log.info("Correct " + GlobalFamArray[0][ArrayFaml].IDName + "' presence state, the device was set as offline even though the entrance door was closed.");
                                    setTimeout(function() {
                                        Adapter.GetFamilyPresentNumber();
                                    }, 1000);
                                } else {
                                    Adapter.log.info("The entrance has not been opened in the last 10 minutes. Presence check for " + GlobalFamArray[0][ArrayFaml].IDName + " will be skipped..");
                                }
                            }
                        }
                    }
                    for (let ArrayDev in Adapterarray[0]) {
                        //=====================================================Motion===========================================
                        if (Adapterarray[0][ArrayDev].DeviceType == "Motion") {
                            if (id == Adapterarray[0][ArrayDev].MotionObject) {
                                if (state.val.toString() == Adapterarray[0][ArrayDev].MotionObjectString) {
                                    var GetAlarm = Adapter.CheckAlarmState(Adapterarray[0][ArrayDev].AlarmNumber);
                                    if (GetAlarm) {
                                        //================Check State
                                        if (Adapterarray[0][ArrayDev].activate) {
                                            //================Get Day by day
                                            var RetDay = Adapter.getDayWeek(Adapterarray[0][ArrayDev]);
                                            //Adapter.log.info(RetDay);
                                            //================Check Schedule State
                                            if (Adapterarray[0][ArrayDev].Schedule_Enabled) {
                                                //================Check Schedule Time and Day
                                                if (Adapter.inTime(Adapterarray[0][ArrayDev].Schedule_Start, Adapterarray[0][ArrayDev].Schedule_End, RetDay)) {
                                                    //================Check Illumination State
                                                    Adapter.trigerSpeak(Adapterarray[0], ArrayDev);
                                                    if (Adapterarray[0][ArrayDev].MotionIlluminationActiv) {
                                                        //================Check Illumination Value
                                                        var RetIllumination = Adapter.Checkillumination(Adapterarray[0][ArrayDev].IlluminationValue, Adapterarray[0][ArrayDev].IlluminationObject);
                                                        RetIllumination.then((val) => {
                                                            //this.log.info(": return" + val);
                                                            if (val) {
                                                                Adapter.triggerDevice(Adapterarray[0], ArrayDev)
                                                            } else {
                                                                Adapter.log.info(Adapterarray[0][ArrayDev].DeviceIDName + ": (Measured lux differs from the threshold.) motion detected, event is triggered for " + Adapterarray[0][ArrayDev].MotionTimeValue + " seconds.");
                                                            }
                                                        });
                                                    } else {
                                                        //================No Illumination State
                                                        Adapter.triggerDevice(Adapterarray[0], ArrayDev)
                                                        Adapter.log.info(Adapterarray[0][ArrayDev].DeviceIDName + ": (No Illumination) motion detected, event is triggered for " + Adapterarray[0][ArrayDev].MotionTimeValue + " seconds.");
                                                    }
                                                }
                                            } else {
                                                //================No Schdule
                                                Adapter.triggerDevice(Adapterarray[0], ArrayDev)
                                                Adapter.log.info(Adapterarray[0][ArrayDev].DeviceIDName + ": (No Schedule) motion detected, event is triggered for " + Adapterarray[0][ArrayDev].MotionTimeValue + " seconds.");
                                            }
                                        }
                                    } else {
                                        Adapter.log.info("Alarm returns incorrect settings! Alarm setting is " + Adapterarray[0][ArrayDev].AlarmNumber + ", the current alarm is " + CommandSPTG.AlarmObject);
                                    }
                                }
                            }
                            //=====================================================Reed===========================================
                        } else if (Adapterarray[0][ArrayDev].DeviceType == "Reed") {
                            if (id == Adapterarray[0][ArrayDev].ReedObject) {
                                if (state.val.toString() == Adapterarray[0][ArrayDev].ReedObjectString) {
                                    if (CommandSPTG.AlarmObject.toString() !== '0') {
                                        Adapter.GetEntrance(Adapterarray[0], ArrayDev);
                                    }
                                    var GetAlarm = Adapter.CheckAlarmState(Adapterarray[0][ArrayDev].AlarmNumber);
                                    if (GetAlarm) {
                                        //================Check State
                                        if (Adapterarray[0][ArrayDev].activate) {
                                            //================Get Day by day
                                            var RetDay = Adapter.getDayWeek(Adapterarray[0][ArrayDev]);
                                            //Adapter.log.info(RetDay);
                                            //================Check Schedule State
                                            if (Adapterarray[0][ArrayDev].Schedule_Enabled) {
                                                //================Check Schedule Time and Day
                                                if (Adapter.inTime(Adapterarray[0][ArrayDev].Schedule_Start, Adapterarray[0][ArrayDev].Schedule_End, RetDay)) {
                                                    Adapter.trigerSpeak(Adapterarray[0], ArrayDev);
                                                    Adapter.trigerReed(Adapterarray[0], ArrayDev);
                                                    //~ Adapter.triggerDevice(Adapterarray[0], ArrayDev)
                                                    Adapter.log.info(Adapterarray[0][ArrayDev].DeviceIDName + ": Window & Door State changed, event is triggered");
                                                }
                                            } else {
                                                //================No Schdule
                                                Adapter.trigerSpeak(Adapterarray[0], ArrayDev);
                                                Adapter.trigerReed(Adapterarray[0], ArrayDev);
                                                Adapter.log.info(Adapterarray[0][ArrayDev].DeviceIDName + ": (No Schedule) Window & Door State changed, event is triggered");
                                            }
                                        }
                                    } else {
                                        Adapter.log.info("Alarm returns incorrect settings! Alarm setting is " + Adapterarray[0][ArrayDev].AlarmNumber + ", the current alarm is " + CommandSPTG.AlarmObject);
                                    }
                                } else {
                                    //****************************************Clear Countdown*************************************************
                                    var CountdownIndex = [Adapterarray[0][ArrayDev].DeviceType + "-" + Adapterarray[0][ArrayDev].DeviceIDName];
                                    if (Reedcountdown[CountdownIndex] !== undefined) {
                                        clearTimeout(Reedcountdown[CountdownIndex]);
                                    }
                                }
                            }
                            //=====================================================Other===========================================
                        } else if (Adapterarray[0][ArrayDev].DeviceType == "Other") {
                            if (id == Adapterarray[0][ArrayDev].OtherObject) {

                                //=======================================check Value (comparison)=======================================
                                if (/=|<|>/.test(Adapterarray[0][ArrayDev].OtherObjectValue)) {
                                    var getOtherStateVal = Adapter.CheckOtherState(Adapterarray[0][ArrayDev].OtherObjectValue, Adapterarray[0][ArrayDev].OtherObject);
                                    getOtherStateVal.then((val) => {
                                        if (val) {
											var GetAlarm = Adapter.CheckAlarmState(Adapterarray[0][ArrayDev].AlarmNumber);
                                            if (GetAlarm) {
                                                //================Check State
                                                if (Adapterarray[0][ArrayDev].activate) {
                                                    //================Get Day by day
                                                    var RetDay = Adapter.getDayWeek(Adapterarray[0][ArrayDev]);
                                                    //================Check Schedule State
                                                    if (Adapterarray[0][ArrayDev].Schedule_Enabled) {
                                                        //================Check Schedule Time and Day
                                                        if (Adapter.inTime(Adapterarray[0][ArrayDev].Schedule_Start, Adapterarray[0][ArrayDev].Schedule_End, RetDay)) {
                                                            Adapter.trigerSpeak(Adapterarray[0], ArrayDev);
                                                            Adapter.trigerOther(Adapterarray[0], ArrayDev);
                                                            Adapter.log.info(Adapterarray[0][ArrayDev].DeviceIDName + ": Other State changed, event is triggered");
                                                        }
                                                    } else {
                                                        //================No Schdule
                                                        Adapter.trigerSpeak(Adapterarray[0], ArrayDev);
                                                        Adapter.trigerOther(Adapterarray[0], ArrayDev);
                                                        Adapter.log.info(Adapterarray[0][ArrayDev].DeviceIDName + ": (No Schedule) Other State changed, event is triggered");
                                                    }
                                                }
                                            } else {
                                                Adapter.log.info("Alarm returns incorrect settings! Alarm setting is " + Adapterarray[0][ArrayDev].AlarmNumber + ", the current alarm is " + CommandSPTG.AlarmObject);
                                            }
                                        } else {
                                            //****************************************Clear Countdown*************************************************
                                            var CountdownIndex = [Adapterarray[0][ArrayDev].DeviceType + "-" + Adapterarray[0][ArrayDev].DeviceIDName];
                                            if (Othercountdown[CountdownIndex] !== undefined) {
                                                clearTimeout(Othercountdown[CountdownIndex]);
                                            }
                                            //***********************************************************Other False***********************************************
                                            for (let ArrayOther in Adapterarray[0]) {
                                                //================Check Device List
                                                var FindAllTriger = Adapter.checkTrigger(Adapterarray[0][ArrayOther].trigerswitch);
                                                var iFA;
                                                for (iFA = 0; iFA < FindAllTriger.length; iFA++) {
                                                    if (FindAllTriger[iFA].toString() == Adapterarray[0][ArrayDev].DeviceType + "-" + Adapterarray[0][ArrayDev].DeviceIDName) {
                                                        Adapter.log.info("==> " + iFA + "/" + FindAllTriger.length + " / " + FindAllTriger[iFA] + " = " + Adapterarray[0][ArrayDev].DeviceType + "-" + Adapterarray[0][ArrayDev].DeviceIDName);
                                                        var GetAlarm = Adapter.CheckAlarmState(Adapterarray[0][ArrayOther].AlarmNumber);
                                                        if (GetAlarm) {
                                                            //================Check State (Device)
                                                            if (Adapterarray[0][ArrayOther].activate) {
                                                                //================Check Schedule Time and Day (Device)
                                                                var DevRetDay = Adapter.getDayWeek(Adapterarray[0][ArrayOther]);
                                                                if (Adapter.inTime(Adapterarray[0][ArrayOther].Schedule_Start, Adapterarray[0][ArrayOther].Schedule_End, DevRetDay)) {
                                                                    if (Adapterarray[0][ArrayOther].OnState) {
                                                                        var StringToCommandon = Adapterarray[0][ArrayOther].OnObjectString;
                                                                        var ObjectToCommandon = Adapterarray[0][ArrayOther].OnObject;
                                                                        var StringToCommandoff = Adapterarray[0][ArrayOther].OffObjectString;
                                                                        var ObjectToCommandoff = Adapterarray[0][ArrayOther].OffObject;
                                                                    } else {
                                                                        var StringToCommandon = Adapterarray[0][ArrayOther].OffObjectString;
                                                                        var ObjectToCommandon = Adapterarray[0][ArrayOther].OffObject;
                                                                        var StringToCommandoff = Adapterarray[0][ArrayOther].OnObjectString;
                                                                        var ObjectToCommandoff = Adapterarray[0][ArrayOther].OnObject;
                                                                    }
                                                                    Adapter.log.info("Found Switch: " + ObjectToCommandoff + " with: " + StringToCommandoff);
                                                                    if (/^#[0-9A-F]{6}$/i.test(StringToCommandoff)) { //Color
                                                                        Adapter.setForeignStateAsync(ObjectToCommandoff, StringToCommandoff);
                                                                    } else if ((/\d+/g.test(StringToCommandoff)) || (/true/g.test(StringToCommandoff)) || (/false/g.test(StringToCommandoff))) { // State
                                                                        Adapter.setForeignStateAsync(ObjectToCommandoff, eval(StringToCommandoff));
                                                                    } else { // Other
                                                                        Adapter.setForeignStateAsync(ObjectToCommandoff, StringToCommandoff);
                                                                    }
                                                                } else {
                                                                    // Adapter.log.info(Adapterarray[0][strArrayDev].DeviceIDName + ": motion detected, defined times returns false!");
                                                                }
                                                            }
                                                        } else {
                                                            Adapter.log.info("Alarm returns incorrect settings! Alarm setting is " + Adapterarray[0][ArrayOther].AlarmNumber + ", the current alarm is " + CommandSPTG.AlarmObject);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    });
                                } else {
                                    //=======================================Check String=============================================
                                    if (state.val.toString() == Adapterarray[0][ArrayDev].OtherObjectValue) {
										var GetAlarm = Adapter.CheckAlarmState(Adapterarray[0][ArrayDev].AlarmNumber);
                                        if (GetAlarm) {
                                            //================Check State
                                            if (Adapterarray[0][ArrayDev].activate) {
                                                //================Get Day by day
                                                var RetDay = Adapter.getDayWeek(Adapterarray[0][ArrayDev]);
                                                //================Check Schedule State
                                                if (Adapterarray[0][ArrayDev].Schedule_Enabled) {
                                                    //================Check Schedule Time and Day
                                                    if (Adapter.inTime(Adapterarray[0][ArrayDev].Schedule_Start, Adapterarray[0][ArrayDev].Schedule_End, RetDay)) {
                                                        Adapter.trigerSpeak(Adapterarray[0], ArrayDev);
                                                        Adapter.trigerOther(Adapterarray[0], ArrayDev);
                                                        Adapter.log.info(Adapterarray[0][ArrayDev].DeviceIDName + ": Other State changed, event is triggered");
                                                    }
                                                } else {
                                                    //================No Schdule
                                                    Adapter.trigerSpeak(Adapterarray[0], ArrayDev);
                                                    Adapter.trigerOther(Adapterarray[0], ArrayDev);
                                                    Adapter.log.info(Adapterarray[0][ArrayDev].DeviceIDName + ": (No Schedule) Other State changed, event is triggered");
                                                }
                                            }
                                        } else {
                                            Adapter.log.info("Alarm returns incorrect settings! Alarm setting is " + Adapterarray[0][ArrayDev].AlarmNumber + ", the current alarm is " + CommandSPTG.AlarmObject);
                                        }
                                    } else {
                                        //****************************************Clear Countdown*************************************************
                                        var CountdownIndex = [Adapterarray[0][ArrayDev].DeviceType + "-" + Adapterarray[0][ArrayDev].DeviceIDName];
                                        if (Othercountdown[CountdownIndex] !== undefined) {
                                            clearTimeout(Othercountdown[CountdownIndex]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    // The state was deleted
                    this.log.info(`state ${id} deleted`);
                }
            }
            //**********************************************************************************************************************************************************
            //***********************************************************************Get and Save***********************************************************************
            //**********************************************************************************************************************************************************
        async onMessage(recivemsg) {
            const Adapter = this;
            Adapter.log.debug('Got a Message: ' + recivemsg.command);
            let ToCreateChannel = recivemsg.message.DeviceType + "." + recivemsg.message.DeviceIDName;
            if (recivemsg.command === 'adddevice') {
                Adapter.createDeviceAsync(recivemsg.message.DeviceType);
                await Adapter.setObjectNotExistsAsync(recivemsg.message.DeviceType, {
                    type: "device",
                    common: {
                        name: recivemsg.message.DeviceType,
                        write: false
                    },
                    native: {}
                });
                Adapter.createChannelAsync(recivemsg.message.DeviceType, recivemsg.message.DeviceIDName);
                await Adapter.setObjectNotExistsAsync(ToCreateChannel, {
                    type: "channel",
                    common: {
                        name: recivemsg.message.DeviceIDName,
                        write: false
                    },
                    native: {}
                });
                await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.DeviceIDName', {
                    type: "state",
                    common: {
                        name: 'DeviceIDName',
                        desc: 'DeviceIDName',
                        type: 'string',
                        role: 'text',
                        write: false
                    },
                    native: {}
                });
                Adapter.setStateAsync(ToCreateChannel + '.DeviceIDName', recivemsg.message.DeviceIDName, true);
                await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.DeviceType', {
                    type: "state",
                    common: {
                        name: 'DeviceType',
                        desc: 'DeviceType',
                        type: 'string',
                        role: 'text',
                        write: false
                    },
                    native: {}
                });
                Adapter.setStateAsync(ToCreateChannel + '.DeviceType', recivemsg.message.DeviceType, true);
                switch (recivemsg.message.DeviceType) {
                    case "Switch":
                        await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.OnState', {
                            type: "state",
                            common: {
                                name: 'OnState',
                                desc: 'OnState',
                                type: 'boolean',
                                role: 'switch',
                                write: false
                            },
                            native: {}
                        });
                        Adapter.setStateAsync(ToCreateChannel + '.OnState', recivemsg.message.OnState, true);
                        await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.OnObject', {
                            type: "state",
                            common: {
                                name: 'OnObject',
                                desc: 'OnObject',
                                type: 'string',
                                role: 'text',
                                write: false
                            },
                            native: {}
                        });
                        Adapter.setStateAsync(ToCreateChannel + '.OnObject', recivemsg.message.OnObject, true);
                        await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.OnObjectString', {
                            type: "state",
                            common: {
                                name: 'OnObjectString',
                                desc: 'OnObjectString',
                                type: 'string',
                                role: 'text',
                                write: false
                            },
                            native: {}
                        });
                        Adapter.setStateAsync(ToCreateChannel + '.OnObjectString', recivemsg.message.OnObjectString, true);
                        await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.OffState', {
                            type: "state",
                            common: {
                                name: 'OffState',
                                desc: 'OffState',
                                type: 'boolean',
                                role: 'switch',
                                write: false
                            },
                            native: {}
                        });
                        Adapter.setStateAsync(ToCreateChannel + '.OffState', recivemsg.message.OffState, true);
                        await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.OffObject', {
                            type: "state",
                            common: {
                                name: 'OffObject',
                                desc: 'OffObject',
                                type: 'string',
                                role: 'text',
                                write: false
                            },
                            native: {}
                        });
                        Adapter.setStateAsync(ToCreateChannel + '.OffObject', recivemsg.message.OffObject, true);
                        await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.OffObjectString', {
                            type: "state",
                            common: {
                                name: 'OffObjectString',
                                desc: 'OffObjectString',
                                type: 'string',
                                role: 'text',
                                write: false
                            },
                            native: {}
                        });
                        Adapter.setStateAsync(ToCreateChannel + '.OffObjectString', recivemsg.message.OffObjectString, true);
						await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.SwitchMode', {
                            type: "state",
                            common: {
                                name: 'SwitchMode',
                                desc: 'SwitchMode',
                                type: 'string',
                                role: 'text',
                                write: false
                            },
                            native: {}
                        });
                        Adapter.setStateAsync(ToCreateChannel + '.SwitchMode', recivemsg.message.SwitchMode, true);
                        await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.trigerswitch', {
                            type: "state",
                            common: {
                                name: 'trigerswitch',
                                desc: 'trigerswitch',
                                type: 'string',
                                role: 'text',
                                write: false
                            },
                            native: {}
                        });
                        Adapter.setStateAsync(ToCreateChannel + '.trigerswitch', recivemsg.message.trigerswitch, true);
                        break;
                    case "Reed":
                        await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.ReedObject', {
                            type: "state",
                            common: {
                                name: 'ReedObject',
                                desc: 'ReedObject',
                                type: 'string',
                                role: 'text',
                                write: false
                            },
                            native: {}
                        });
                        Adapter.setStateAsync(ToCreateChannel + '.ReedObject', recivemsg.message.ReedObject, true);
                        await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.ReedObjectString', {
                            type: "state",
                            common: {
                                name: 'ReedObjectString',
                                desc: 'ReedObjectString',
                                type: 'string',
                                role: 'text',
                                write: false
                            },
                            native: {}
                        });
                        Adapter.setStateAsync(ToCreateChannel + '.ReedObjectString', recivemsg.message.ReedObjectString, true);
                        await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.EntranceState', {
                            type: "state",
                            common: {
                                name: 'EntranceState',
                                desc: 'EntranceState',
                                type: 'boolean',
                                role: 'switch',
                                write: false
                            },
                            native: {}
                        });
                        Adapter.setStateAsync(ToCreateChannel + '.EntranceState', recivemsg.message.EntranceState, true);
                        await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.ReedTimeValue', {
                            type: "state",
                            common: {
                                name: 'ReedTimeValue',
                                desc: 'ReedTimeValue',
                                type: 'string',
                                role: 'text',
                                write: false
                            },
                            native: {}
                        });
                        Adapter.setStateAsync(ToCreateChannel + '.ReedTimeValue', recivemsg.message.ReedTimeValue, true);
                        await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.ReedCountdownValue', {
                            type: "state",
                            common: {
                                name: 'ReedCountdownValue',
                                desc: 'ReedCountdownValue',
                                type: 'string',
                                role: 'text',
                                write: false
                            },
                            native: {}
                        });
                        Adapter.setStateAsync(ToCreateChannel + '.ReedCountdownValue', recivemsg.message.ReedCountdownValue, true);
                        break;
                    case "Motion":
                        await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.MotionObject', {
                            type: "state",
                            common: {
                                name: 'MotionObject',
                                desc: 'MotionObject',
                                type: 'string',
                                role: 'text',
                                write: false
                            },
                            native: {}
                        });
                        Adapter.setStateAsync(ToCreateChannel + '.MotionObject', recivemsg.message.MotionObject, true);
                        await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.MotionObjectString', {
                            type: "state",
                            common: {
                                name: 'MotionObjectString',
                                desc: 'MotionObjectString',
                                type: 'string',
                                role: 'text',
                                write: false
                            },
                            native: {}
                        });
                        Adapter.setStateAsync(ToCreateChannel + '.MotionObjectString', recivemsg.message.MotionObjectString, true);
                        await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.IlluminationObject', {
                            type: "state",
                            common: {
                                name: 'IlluminationObject',
                                desc: 'IlluminationObject',
                                type: 'string',
                                role: 'text',
                                write: false
                            },
                            native: {}
                        });
                        Adapter.setStateAsync(ToCreateChannel + '.IlluminationObject', recivemsg.message.IlluminationObject, true);
                        await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.MotionIlluminationActiv', {
                            type: "state",
                            common: {
                                name: 'MotionIlluminationActiv',
                                desc: 'MotionIlluminationActiv',
                                type: 'boolean',
                                role: 'switch',
                                write: false
                            },
                            native: {}
                        });
                        Adapter.setStateAsync(ToCreateChannel + '.MotionIlluminationActiv', recivemsg.message.MotionIlluminationActiv, true);
                        await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.IlluminationValue', {
                            type: "state",
                            common: {
                                name: 'IlluminationValue',
                                desc: 'IlluminationValue',
                                type: 'string',
                                role: 'text',
                                write: false
                            },
                            native: {}
                        });
                        Adapter.setStateAsync(ToCreateChannel + '.IlluminationValue', recivemsg.message.IlluminationValue, true);
                        await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.MotionTimeValue', {
                            type: "state",
                            common: {
                                name: 'MotionTimeValue',
                                desc: 'MotionTimeValue',
                                type: 'string',
                                role: 'text',
                                write: false
                            },
                            native: {}
                        });
                        Adapter.setStateAsync(ToCreateChannel + '.MotionTimeValue', recivemsg.message.MotionTimeValue, true);
                        break;
                    case "Other":
                        await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.OtherObject', {
                            type: "state",
                            common: {
                                name: 'OtherObject',
                                desc: 'OtherObject',
                                type: 'string',
                                role: 'text',
                                write: false
                            },
                            native: {}
                        });
                        Adapter.setStateAsync(ToCreateChannel + '.OtherObject', recivemsg.message.OtherObject, true);
                        await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.OtherObjectValue', {
                            type: "state",
                            common: {
                                name: 'OtherObjectValue',
                                desc: 'OtherObjectValue',
                                type: 'string',
                                role: 'text',
                                write: false
                            },
                            native: {}
                        });
                        Adapter.setStateAsync(ToCreateChannel + '.OtherObjectValue', recivemsg.message.OtherObjectValue, true);
                        await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.OtherTimeValue', {
                            type: "state",
                            common: {
                                name: 'OtherTimeValue',
                                desc: 'OtherTimeValue',
                                type: 'string',
                                role: 'text',
                                write: false
                            },
                            native: {}
                        });
                        Adapter.setStateAsync(ToCreateChannel + '.OtherTimeValue', recivemsg.message.OtherTimeValue, true);
                        await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.OtherCountdownValue', {
                            type: "state",
                            common: {
                                name: 'OtherCountdownValue',
                                desc: 'OtherCountdownValue',
                                type: 'string',
                                role: 'text',
                                write: false
                            },
                            native: {}
                        });
                        Adapter.setStateAsync(ToCreateChannel + '.OtherCountdownValue', recivemsg.message.OtherCountdownValue, true);
                        break;
                    case "Timer":
                        await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.TimerObject', {
                            type: "state",
                            common: {
                                name: 'TimerObject',
                                desc: 'TimerObject',
                                type: 'string',
                                role: 'text',
                                write: false
                            },
                            native: {}
                        });
                        Adapter.setStateAsync(ToCreateChannel + '.TimerObject', recivemsg.message.TimerObject, true);
                        await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.TimerTimeValue', {
                            type: "state",
                            common: {
                                name: 'TimerTimeValue',
                                desc: 'TimerTimeValue',
                                type: 'string',
                                role: 'text',
                                write: false
                            },
                            native: {}
                        });
                        Adapter.setStateAsync(ToCreateChannel + '.TimerTimeValue', recivemsg.message.TimerTimeValue, true);
                        await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.TimerCountdownValue', {
                            type: "state",
                            common: {
                                name: 'TimerCountdownValue',
                                desc: 'TimerCountdownValue',
                                type: 'string',
                                role: 'text',
                                write: false
                            },
                            native: {}
                        });
                        Adapter.setStateAsync(ToCreateChannel + '.TimerCountdownValue', recivemsg.message.TimerCountdownValue, true);
                        break;
                }
                await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.Schedule_Enabled', {
                    type: "state",
                    common: {
                        name: 'Schedule_Enabled',
                        desc: 'Schedule_Enabled',
                        type: 'boolean',
                        role: 'switch',
                        write: false
                    },
                    native: {}
                });
                Adapter.setStateAsync(ToCreateChannel + '.Schedule_Enabled', recivemsg.message.Schedule_Enabled, true);
                await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.Schedule_Monday', {
                    type: "state",
                    common: {
                        name: 'Schedule_Monday',
                        desc: 'Schedule_Monday',
                        type: 'boolean',
                        role: 'switch',
                        write: false
                    },
                    native: {}
                });
                Adapter.setStateAsync(ToCreateChannel + '.Schedule_Monday', recivemsg.message.Schedule_Monday, true);
                await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.Schedule_Tuesday', {
                    type: "state",
                    common: {
                        name: 'Schedule_Tuesday',
                        desc: 'Schedule_Tuesday',
                        type: 'boolean',
                        role: 'switch',
                        write: false
                    },
                    native: {}
                });
                Adapter.setStateAsync(ToCreateChannel + '.Schedule_Tuesday', recivemsg.message.Schedule_Tuesday, true);
                await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.Schedule_Wednesday', {
                    type: "state",
                    common: {
                        name: 'Schedule_Wednesday',
                        desc: 'Schedule_Wednesday',
                        type: 'boolean',
                        role: 'switch',
                        write: false
                    },
                    native: {}
                });
                Adapter.setStateAsync(ToCreateChannel + '.Schedule_Wednesday', recivemsg.message.Schedule_Wednesday, true);
                await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.Schedule_Thursday', {
                    type: "state",
                    common: {
                        name: 'Schedule_Thursday',
                        desc: 'Schedule_Thursday',
                        type: 'boolean',
                        role: 'switch',
                        write: false
                    },
                    native: {}
                });
                Adapter.setStateAsync(ToCreateChannel + '.Schedule_Thursday', recivemsg.message.Schedule_Thursday, true);
                await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.Schedule_Friday', {
                    type: "state",
                    common: {
                        name: 'Schedule_Friday',
                        desc: 'Schedule_Friday',
                        type: 'boolean',
                        role: 'switch',
                        write: false
                    },
                    native: {}
                });
                Adapter.setStateAsync(ToCreateChannel + '.Schedule_Friday', recivemsg.message.Schedule_Friday, true);
                await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.Schedule_Saturday', {
                    type: "state",
                    common: {
                        name: 'Schedule_Saturday',
                        desc: 'Schedule_Saturday',
                        type: 'boolean',
                        role: 'switch',
                        write: false
                    },
                    native: {}
                });
                Adapter.setStateAsync(ToCreateChannel + '.Schedule_Saturday', recivemsg.message.Schedule_Saturday, true);
                await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.Schedule_Sunday', {
                    type: "state",
                    common: {
                        name: 'Schedule_Sunday',
                        desc: 'Schedule_Sunday',
                        type: 'boolean',
                        role: 'switch',
                        write: false
                    },
                    native: {}
                });
                Adapter.setStateAsync(ToCreateChannel + '.Schedule_Sunday', recivemsg.message.Schedule_Sunday, true);
                await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.Schedule_Start', {
                    type: "state",
                    common: {
                        name: 'Schedule_Start',
                        desc: 'Schedule_Start',
                        type: 'string',
                        role: 'text',
                        write: false
                    },
                    native: {}
                });
                Adapter.setStateAsync(ToCreateChannel + '.Schedule_Start', recivemsg.message.Schedule_Start, true);
                await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.Schedule_End', {
                    type: "state",
                    common: {
                        name: 'Schedule_End',
                        desc: 'Schedule_End',
                        type: 'string',
                        role: 'text',
                        write: false
                    },
                    native: {}
                });
                Adapter.setStateAsync(ToCreateChannel + '.Schedule_End', recivemsg.message.Schedule_End, true);
                await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.Speach', {
                    type: "state",
                    common: {
                        name: 'Speach',
                        desc: 'Speach',
                        type: 'boolean',
                        role: 'switch',
                        write: true
                    },
                    native: {}
                });
                Adapter.setStateAsync(ToCreateChannel + '.Speach', recivemsg.message.Speach, true);
                await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.Echos', {
                    type: "state",
                    common: {
                        name: 'Echos',
                        desc: 'Echos',
                        type: 'string',
                        role: 'text',
                        write: false
                    },
                    native: {}
                });
                Adapter.setStateAsync(ToCreateChannel + '.Echos', recivemsg.message.Echos, true);
                await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.SpeachString', {
                    type: "state",
                    common: {
                        name: 'SpeachString',
                        desc: 'SpeachString',
                        type: 'string',
                        role: 'text',
                        write: false
                    },
                    native: {}
                });
                Adapter.setStateAsync(ToCreateChannel + '.SpeachString', recivemsg.message.SpeachString, true);
                await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.AlarmNumber', {
                    type: "state",
                    common: {
                        name: 'AlarmNumber',
                        desc: 'AlarmNumber',
                        type: 'string',
                        role: 'text',
                        write: false
                    },
                    native: {}
                });
                Adapter.setStateAsync(ToCreateChannel + '.AlarmNumber', recivemsg.message.AlarmNumber, true);
                await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.activate', {
                    type: "state",
                    common: {
                        name: 'activate',
                        desc: 'activate',
                        type: 'boolean',
                        role: 'switch',
                        write: true
                    },
                    native: {}
                });
                Adapter.setStateAsync(ToCreateChannel + '.activate', recivemsg.message.activate, true);
                Adapter.sendTo(recivemsg.from, recivemsg.command, {
                    success: true
                }, recivemsg.callback);
            }
            if (recivemsg.command === 'getdevice') {
                let devicearray = {};
                let LogTextStringSwitch = "",
                    LogTextNumberSwitch = 0;
                let LogTextStringMotion = "",
                    LogTextNumberMotion = 0;
                let LogTextStringReed = "",
                    LogTextNumberReed = 0;
                let LogTextStringOther = "",
                    LogTextNumberOther = 0;
                let LogTextStringTimer = "",
                    LogTextNumberTimer = 0;
                let devicenumber = await Adapter.getDevicesAsync('');
                for (let idx = 0; idx < devicenumber.length; idx++) {
                    let AllMyDevicename = await Adapter.getChannelsOfAsync(devicenumber[idx].common.name);
                    let MyDevicename = devicenumber[idx].common.name;
                    for (let idxS = 0; idxS < AllMyDevicename.length; idxS++) {
                        let MyChannelname = AllMyDevicename[idxS].common.name;
                        // switch (MyDevicename) {
                        //	if ((MyDevicename == "Switch") || (MyDevicename == "Motion") || (MyDevicename == "Reed") || (MyDevicename == "Heater")){
                        /*******************************************************Filter All************************************************************************************/
                        //case "Switch": case "Motion": case "Reed": case "Heater":
                        //Adapter.log.info("Split: " + MyChannelname);
                        let DeviceIDName = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.DeviceIDName');
                        let DeviceType = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.DeviceType');
                        let Schedule_Enabled = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.Schedule_Enabled');
                        let Schedule_Start = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.Schedule_Start');
                        let Schedule_End = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.Schedule_End');
                        let Schedule_Monday = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.Schedule_Monday');
                        let Schedule_Tuesday = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.Schedule_Tuesday');
                        let Schedule_Wednesday = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.Schedule_Wednesday');
                        let Schedule_Thursday = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.Schedule_Thursday');
                        let Schedule_Friday = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.Schedule_Friday');
                        let Schedule_Saturday = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.Schedule_Saturday');
                        let Schedule_Sunday = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.Schedule_Sunday');
                        let Speach = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.Speach');
                        let Echos = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.Echos');
                        let SpeachString = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.SpeachString');
                        let AlarmNumber = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.AlarmNumber');
                        let activate = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.activate');
                        // break;
                        //}
                        switch (MyDevicename) {
                            /*******************************************************Switch************************************************************************************/
                            case "Switch":
                                LogTextStringSwitch += MyChannelname + ' | ';
                                LogTextNumberSwitch += 1;
                                let OnState = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.OnState');
                                let OnObject = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.OnObject');
                                let OnObjectString = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.OnObjectString');
                                let OffState = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.OffState');
                                let OffObject = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.OffObject');
                                let OffObjectString = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.OffObjectString');
                                let trigerswitch = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.trigerswitch');
                                devicearray[MyChannelname] = {
                                    DeviceIDName: DeviceIDName.val,
                                    DeviceType: DeviceType.val,
                                    OnState: OnState.val,
                                    OnObject: OnObject.val,
                                    OnObjectString: OnObjectString.val,
                                    OffState: OffState.val,
                                    OffObject: OffObject.val,
                                    OffObjectString: OffObjectString.val,
                                    Schedule_Enabled: Schedule_Enabled,
                                    Schedule_Start: Schedule_Start.val,
                                    Schedule_End: Schedule_End.val,
                                    Schedule_Monday: Schedule_Monday.val,
                                    Schedule_Tuesday: Schedule_Tuesday.val,
                                    Schedule_Wednesday: Schedule_Wednesday.val,
                                    Schedule_Thursday: Schedule_Thursday.val,
                                    Schedule_Friday: Schedule_Friday.val,
                                    Schedule_Saturday: Schedule_Saturday.val,
                                    Schedule_Sunday: Schedule_Sunday.val,
                                    Speach: Speach.val,
                                    Echos: Echos.val,
                                    SpeachString: SpeachString.val,
                                    AlarmNumber: AlarmNumber.val,
                                    trigerswitch: trigerswitch.val,
                                    activate: activate.val
                                };
                                //Adapter.log.info("Switchs: " + JSON.stringify(devicearray));
                                //Adapter.log.info('Found: ' + LogTextNumberSwitch + ' Switchs: ' + LogTextStringSwitch);
                                break;
                                /*******************************************************Reed************************************************************************************/
                            case "Reed":
                                LogTextStringReed += MyChannelname + ' | ';
                                LogTextNumberReed += 1;
                                let ReedObject = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.ReedObject');
                                let ReedObjectString = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.ReedObjectString');
                                let EntranceState = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.EntranceState');
                                let ReedTimeValue = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.ReedTimeValue');
                                let ReedCountdownValue = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.ReedCountdownValue');
                                devicearray[MyChannelname] = {
                                    DeviceIDName: DeviceIDName.val,
                                    DeviceType: DeviceType.val,
                                    ReedObject: ReedObject.val,
                                    ReedObjectString: ReedObjectString.val,
                                    EntranceState: EntranceState.val,
                                    ReedTimeValue: ReedTimeValue.val,
                                    ReedCountdownValue: ReedCountdownValue.val,
                                    Schedule_Enabled: Schedule_Enabled,
                                    Schedule_Start: Schedule_Start.val,
                                    Schedule_End: Schedule_End.val,
                                    Schedule_Monday: Schedule_Monday.val,
                                    Schedule_Tuesday: Schedule_Tuesday.val,
                                    Schedule_Wednesday: Schedule_Wednesday.val,
                                    Schedule_Thursday: Schedule_Thursday.val,
                                    Schedule_Friday: Schedule_Friday.val,
                                    Schedule_Saturday: Schedule_Saturday.val,
                                    Schedule_Sunday: Schedule_Sunday.val,
                                    Speach: Speach.val,
                                    Echos: Echos.val,
                                    SpeachString: SpeachString.val,
                                    AlarmNumber: AlarmNumber.val,
                                    activate: activate.val
                                };
                                //Adapter.log.info("Reeds: " + JSON.stringify(devicearray));
                                //Adapter.log.info('Found: ' + LogTextNumberReed + ' Reeds: ' + LogTextStringReed);
                                break;
                                /*******************************************************MOTIONS************************************************************************************/
                            case "Motion":
                                LogTextStringMotion += MyChannelname + ' | ';
                                LogTextNumberMotion += 1;
                                let MotionObject = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.MotionObject');
                                let MotionObjectString = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.MotionObjectString');
                                let MotionIlluminationActiv = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.MotionIlluminationActiv');
                                let IlluminationObject = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.IlluminationObject');
                                let IlluminationValue = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.IlluminationValue');
                                let MotionTimeValue = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.MotionTimeValue');
                                devicearray[MyChannelname] = {
                                        DeviceIDName: DeviceIDName.val,
                                        DeviceType: DeviceType.val,
                                        MotionObject: MotionObject.val,
                                        MotionObjectString: MotionObjectString.val,
                                        MotionIlluminationActiv: MotionIlluminationActiv.val,
                                        IlluminationObject: IlluminationObject.val,
                                        IlluminationValue: IlluminationValue.val,
                                        MotionTimeValue: MotionTimeValue.val,
                                        Schedule_Enabled: Schedule_Enabled,
                                        Schedule_Start: Schedule_Start.val,
                                        Schedule_End: Schedule_End.val,
                                        Schedule_Monday: Schedule_Monday.val,
                                        Schedule_Tuesday: Schedule_Tuesday.val,
                                        Schedule_Wednesday: Schedule_Wednesday.val,
                                        Schedule_Thursday: Schedule_Thursday.val,
                                        Schedule_Friday: Schedule_Friday.val,
                                        Schedule_Saturday: Schedule_Saturday.val,
                                        Schedule_Sunday: Schedule_Sunday.val,
                                        Speach: Speach.val,
                                        Echos: Echos.val,
                                        SpeachString: SpeachString.val,
                                        AlarmNumber: AlarmNumber.val,
                                        activate: activate.val
                                    }
                                    //Adapter.log.info("Motions: " + JSON.stringify(devicearray));
                                    //Adapter.log.info('Found: ' + LogTextNumberMotion + ' Motions: ' + LogTextStringMotion);
                                break;
                                /*******************************************************Other***********************************************************************************/
                            case "Other":
                                LogTextStringOther += MyChannelname + ' | ';
                                LogTextNumberOther += 1;
                                let OtherObject = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.OtherObject');
                                let OtherObjectValue = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.OtherObjectValue');
                                let OtherTimeValue = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.OtherTimeValue');
                                let OtherCountdownValue = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.OtherCountdownValue');
                                devicearray[MyChannelname] = {
                                    DeviceIDName: DeviceIDName.val,
                                    DeviceType: DeviceType.val,
                                    OtherObject: OtherObject.val,
                                    OtherObjectValue: OtherObjectValue.val,
                                    OtherTimeValue: OtherTimeValue.val,
                                    OtherCountdownValue: OtherCountdownValue.val,
                                    Schedule_Enabled: Schedule_Enabled,
                                    Schedule_Start: Schedule_Start.val,
                                    Schedule_End: Schedule_End.val,
                                    Schedule_Monday: Schedule_Monday.val,
                                    Schedule_Tuesday: Schedule_Tuesday.val,
                                    Schedule_Wednesday: Schedule_Wednesday.val,
                                    Schedule_Thursday: Schedule_Thursday.val,
                                    Schedule_Friday: Schedule_Friday.val,
                                    Schedule_Saturday: Schedule_Saturday.val,
                                    Schedule_Sunday: Schedule_Sunday.val,
                                    Speach: Speach.val,
                                    Echos: Echos.val,
                                    SpeachString: SpeachString.val,
                                    AlarmNumber: AlarmNumber.val,
                                    activate: activate.val
                                };
                                //Adapter.log.info("Others: " + JSON.stringify(devicearray));
                                //Adapter.log.info('Found: ' + LogTextNumberOther + ' Others: ' + LogTextStringOther);
                                break;
                                /*******************************************************Other***********************************************************************************/
                            case "Timer":
                                LogTextStringTimer += MyChannelname + ' | ';
                                LogTextNumberTimer += 1;
                                let TimerObject = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.TimerObject');
                                let TimerTimeValue = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.TimerTimeValue');
                                let TimerCountdownValue = await Adapter.getStateAsync(MyDevicename + "." + MyChannelname + '.TimerCountdownValue');
                                devicearray[MyChannelname] = {
                                    DeviceIDName: DeviceIDName.val,
                                    DeviceType: DeviceType.val,
                                    TimerObject: TimerObject.val,
                                    TimerTimeValue: TimerTimeValue.val,
                                    TimerCountdownValue: TimerCountdownValue.val,
                                    Schedule_Enabled: Schedule_Enabled,
                                    Schedule_Start: Schedule_Start.val,
                                    Schedule_End: Schedule_End.val,
                                    Schedule_Monday: Schedule_Monday.val,
                                    Schedule_Tuesday: Schedule_Tuesday.val,
                                    Schedule_Wednesday: Schedule_Wednesday.val,
                                    Schedule_Thursday: Schedule_Thursday.val,
                                    Schedule_Friday: Schedule_Friday.val,
                                    Schedule_Saturday: Schedule_Saturday.val,
                                    Schedule_Sunday: Schedule_Sunday.val,
                                    Speach: Speach.val,
                                    Echos: Echos.val,
                                    SpeachString: SpeachString.val,
                                    AlarmNumber: AlarmNumber.val,
                                    activate: activate.val
                                };
                                //Adapter.log.info("Timers: " + JSON.stringify(devicearray));
                                //Adapter.log.info('Found: ' + LogTextNumberTimer + ' Timers: ' + LogTextStringTimer);
                                break;
                        }
                    }
                }
                Adapter.log.info('Found: ' + LogTextNumberSwitch + ' Switchs: ' + LogTextStringSwitch);
                Adapter.log.info('Found: ' + LogTextNumberReed + ' Reeds: ' + LogTextStringReed);
                Adapter.log.info('Found: ' + LogTextNumberMotion + ' Motions: ' + LogTextStringMotion);
                Adapter.log.info('Found: ' + LogTextNumberOther + ' Other: ' + LogTextStringOther);
                Adapter.log.info('Found: ' + LogTextNumberTimer + ' Timer: ' + LogTextStringTimer);
                Adapter.log.info("==> " + JSON.stringify(devicearray));
                Adapter.sendTo(recivemsg.from, recivemsg.command, {
                    devicearray: devicearray
                }, recivemsg.callback);
            }
            if (recivemsg.command === 'deletedevice') {
                await Adapter.deleteChannel(recivemsg.message.DeviceType, recivemsg.message.DeviceIDName);
                Adapter.sendTo(recivemsg.from, recivemsg.command, {
                    success: true
                }, recivemsg.callback);
            }
            //================================================================Get Echos===============================================================
            if (recivemsg.command === 'GetEchos') {
                let Echosarray = {};
                let LogTextString = "",
                    LogTextNumber = 0;
                let Echosnumber = await Adapter.getStatesAsync('Settings.Echos.*');
                //~ Adapter.log.info("========Echos ==> " +JSON.stringify( Echosnumber));
                for (let idx in Echosnumber) {
                    //~ for (let idx = 0; idx < Echosnumber.length; idx++) {
                    //~ Adapter.log.info("Echos ==> " + Echosnumber[idx].val);
                    let RetMyEchoName = idx.substring(idx.lastIndexOf('.') + 1);
                    let RetMyEchoID = Echosnumber[idx].val;
                    Echosarray[RetMyEchoName] = {
                        EchoName: RetMyEchoName,
                        PresenceObject: RetMyEchoID.val,
                    };
                }
                Adapter.sendTo(recivemsg.from, recivemsg.command, {
                    Echosarray: Echosarray
                }, recivemsg.callback);
                Adapter.log.info("Echos ==> " + JSON.stringify(Echosarray));
            }
            //================================================================Speak===============================================================
            if (recivemsg.command === 'addSpeak') {
                await Adapter.setObjectNotExistsAsync('Settings.SpeakObject', {
                    type: "state",
                    common: {
                        name: 'SpeakObject',
                        desc: 'SpeakObject',
                        type: 'string',
                        role: 'text',
                        write: false
                    },
                    native: {}
                });
                Adapter.setStateAsync('Settings.SpeakObject', recivemsg.message.SpeakObject, true);
                Adapter.sendTo(recivemsg.from, recivemsg.command, {
                    SpeakObject: SpeakObject
                }, recivemsg.callback);
            }
            //================================================================Telegram===============================================================
            if (recivemsg.command === 'addTelegram') {
                await Adapter.setObjectNotExistsAsync('Settings.TelegramObject', {
                    type: "state",
                    common: {
                        name: 'TelegramObject',
                        desc: 'TelegramObject',
                        type: 'string',
                        role: 'text',
                        write: false
                    },
                    native: {}
                });
                Adapter.setStateAsync('Settings.TelegramObject', recivemsg.message.TelegramObject, true);
                Adapter.sendTo(recivemsg.from, recivemsg.command, {
                    TelegramObject: TelegramObject
                }, recivemsg.callback);
            }
            //================================================================SaveSettings===============================================================
            if (recivemsg.command === 'SaveSettings') {
                await Adapter.setObjectNotExistsAsync('Settings.SendAlarmChanges', {
                    type: "state",
                    common: {
                        name: 'SendAlarmChanges',
                        desc: 'SendAlarmChanges',
                        type: 'boolean',
                        role: 'switch',
                        write: false
                    },
                    native: {}
                });
                Adapter.setStateAsync('Settings.SendAlarmChanges', recivemsg.message.SendAlarmChanges, true);
                await Adapter.setObjectNotExistsAsync('Settings.AlarmVoice', {
                    type: "state",
                    common: {
                        name: 'AlarmVoice',
                        desc: 'AlarmVoice',
                        type: 'boolean',
                        role: 'switch',
                        write: false
                    },
                    native: {}
                });
                Adapter.setStateAsync('Settings.AlarmVoice', recivemsg.message.AlarmVoice, true);
                await Adapter.setObjectNotExistsAsync('Settings.AlarmCountdownValue', {
                    type: "state",
                    common: {
                        name: 'AlarmCountdownValue',
                        desc: 'AlarmCountdownValue',
                        type: 'string',
                        role: 'text',
                        write: false
                    },
                    native: {}
                });
                Adapter.setStateAsync('Settings.AlarmCountdownValue', recivemsg.message.AlarmCountdownValue, true);
                await Adapter.setObjectNotExistsAsync('Settings.Welcomephrase', {
                    type: "state",
                    common: {
                        name: 'Welcomephrase',
                        desc: 'Welcomephrase',
                        type: 'string',
                        role: 'text',
                        write: false
                    },
                    native: {}
                });
                Adapter.setStateAsync('Settings.Welcomephrase', recivemsg.message.Welcomephrase, true);
                await Adapter.setObjectNotExistsAsync('Settings.WarningphraseEntrance', {
                    type: "state",
                    common: {
                        name: 'WarningphraseEntrance',
                        desc: 'WarningphraseEntrance',
                        type: 'string',
                        role: 'text',
                        write: false
                    },
                    native: {}
                });
                Adapter.setStateAsync('Settings.WarningphraseEntrance', recivemsg.message.WarningphraseEntrance, true);
                await Adapter.setObjectNotExistsAsync('Settings.WarningphraseMotion', {
                    type: "state",
                    common: {
                        name: 'WarningphraseMotion',
                        desc: 'WarningphraseMotion',
                        type: 'string',
                        role: 'text',
                        write: false
                    },
                    native: {}
                });
                Adapter.setStateAsync('Settings.WarningphraseMotion', recivemsg.message.WarningphraseMotion, true);
                await Adapter.setObjectNotExistsAsync('Settings.VoiceResetLevel', {
                    type: "state",
                    common: {
                        name: 'VoiceResetLevel',
                        desc: 'VoiceResetLevel',
                        type: 'string',
                        role: 'text',
                        write: false
                    },
                    native: {}
                });
                Adapter.setStateAsync('Settings.VoiceResetLevel', recivemsg.message.VoiceResetLevel, true);
                await Adapter.setObjectNotExistsAsync('Settings.VoiceChangeLevel', {
                    type: "state",
                    common: {
                        name: 'VoiceChangeLevel',
                        desc: 'VoiceChangeLevel',
                        type: 'string',
                        role: 'text',
                        write: false
                    },
                    native: {}
                });
                Adapter.setStateAsync('Settings.VoiceChangeLevel', recivemsg.message.VoiceChangeLevel, true);
                Adapter.sendTo(recivemsg.from, recivemsg.command, {
                    SendAlarmChanges: SendAlarmChanges,
                    AlarmVoice: AlarmVoice,
                    AlarmCountdownValue: AlarmCountdownValue,
                    Welcomephrase: Welcomephrase,
                    WarningphraseEntrance: WarningphraseEntrance,
                    WarningphraseMotion: WarningphraseMotion,
                    VoiceResetLevel: VoiceResetLevel,
                    VoiceChangeLevel: VoiceChangeLevel
                }, recivemsg.callback);
            }
            //================================================================Family===============================================================
            if (recivemsg.command === 'getFamily') {
                let Familyarray = {};
                let LogTextString = "",
                    LogTextNumber = 0;
                let Familynumber = await Adapter.getDevicesAsync('');
                for (let idx = 0; idx < Familynumber.length; idx++) {
                    let AllMyFamilyname = await Adapter.getChannelsOfAsync(Familynumber[idx].common.name);
                    let MyFamilyname = Familynumber[idx].common.name;
                    for (let idxS = 0; idxS < AllMyFamilyname.length; idxS++) {
                        let MyChannelname = AllMyFamilyname[idxS].common.name;
                        if (MyFamilyname == "Family") {
                            LogTextString += MyChannelname + ' | '
                            LogTextNumber += 1
                            let IDName = await Adapter.getStateAsync(MyFamilyname + "." + MyChannelname + '.IDName');
                            let PresenceObject = await Adapter.getStateAsync(MyFamilyname + "." + MyChannelname + '.PresenceObject');
                            let PresenceTime = await Adapter.getStateAsync(MyFamilyname + "." + MyChannelname + '.PresenceTime');
                            let PresenceStamp = await Adapter.getStateAsync(MyFamilyname + "." + MyChannelname + '.PresenceStamp');
                            let PresenceState = await Adapter.getStateAsync(MyFamilyname + "." + MyChannelname + '.PresenceState');
                            let AbsentSince = await Adapter.getStateAsync(MyFamilyname + "." + MyChannelname + '.AbsentSince');
                            let Active = await Adapter.getStateAsync(MyFamilyname + "." + MyChannelname + '.Active');
                            Familyarray[MyChannelname] = {
                                IDName: IDName.val,
                                PresenceObject: PresenceObject.val,
                                PresenceTime: PresenceTime.val,
                                PresenceStamp: PresenceStamp.val,
                                PresenceState: PresenceState.val,
                                AbsentSince: AbsentSince.val,
                                Active: Active.val
                            };
                        }
                    }
                }
                //Adapter.log.info('Family: ' + JSON.stringify(Familyarray));
                //Adapter.log.info('Found: ' + LogTextNumber + ' Family member: ' + LogTextString);
                Adapter.sendTo(recivemsg.from, recivemsg.command, {
                    Familyarray: Familyarray
                }, recivemsg.callback);
            }
            if (recivemsg.command === 'addFamily') {
                let ToCreateChannel = "Family." + recivemsg.message.IDName;
                Adapter.createDeviceAsync('Family');
                await Adapter.setObjectNotExistsAsync('Family', {
                    type: "device",
                    common: {
                        name: 'Family',
                        write: false
                    },
                    native: {}
                });
                Adapter.createChannelAsync('Family', recivemsg.message.IDName);
                await Adapter.setObjectNotExistsAsync(ToCreateChannel, {
                    type: "channel",
                    common: {
                        name: recivemsg.message.IDName,
                        write: false
                    },
                    native: {}
                });
                await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.IDName', {
                    type: "state",
                    common: {
                        name: 'IDName',
                        desc: 'IDName',
                        type: 'string',
                        role: 'text',
                        write: false
                    },
                    native: {}
                });
                Adapter.setStateAsync(ToCreateChannel + '.IDName', recivemsg.message.IDName, true);
                await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.PresenceObject', {
                    type: "state",
                    common: {
                        name: 'PresenceObject',
                        desc: 'PresenceObject',
                        type: 'string',
                        role: 'text',
                        write: false
                    },
                    native: {}
                });
                Adapter.setStateAsync(ToCreateChannel + '.PresenceObject', recivemsg.message.PresenceObject, true);
                await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.PresenceTime', {
                    type: "state",
                    common: {
                        name: 'PresenceTime',
                        desc: 'PresenceTime',
                        type: 'string',
                        role: 'text',
                        write: false
                    },
                    native: {}
                });
                Adapter.setStateAsync(ToCreateChannel + '.PresenceTime', recivemsg.message.PresenceTime, true);
                await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.PresenceStamp', {
                    type: "state",
                    common: {
                        name: 'PresenceStamp',
                        desc: 'PresenceStamp',
                        type: 'string',
                        role: 'text',
                        write: false
                    },
                    native: {}
                });
                Adapter.setStateAsync(ToCreateChannel + '.PresenceStamp', "0", true);
                await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.AbsentSince', {
                    type: "state",
                    common: {
                        name: 'AbsentSince',
                        desc: 'AbsentSince',
                        type: 'string',
                        role: 'text',
                        write: false
                    },
                    native: {}
                });
                Adapter.setStateAsync(ToCreateChannel + '.AbsentSince', "0", true);
                await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.PresenceState', {
                    type: "state",
                    common: {
                        name: 'PresenceState',
                        desc: 'PresenceState',
                        type: 'boolean',
                        role: 'switch',
                        write: true
                    },
                    native: {}
                });
                Adapter.setStateAsync(ToCreateChannel + '.PresenceState', false, true);
                await Adapter.setObjectNotExistsAsync(ToCreateChannel + '.Active', {
                    type: "state",
                    common: {
                        name: 'Active',
                        desc: 'Active',
                        type: 'boolean',
                        role: 'switch',
                        write: true
                    },
                    native: {}
                });
                Adapter.setStateAsync(ToCreateChannel + '.Active', recivemsg.message.Active, true);
            }
            if (recivemsg.command === 'deleteFamily') {
                await Adapter.deleteChannel('Family', recivemsg.message.FamilyIDName);
                Adapter.sendTo(recivemsg.from, recivemsg.command, {
                    success: true
                }, recivemsg.callback);
            }
        }
    }
    // @ts-ignore parent is a valid property on module
if (module.parent) {
    // Export the constructor in compact mode
    /**
     * @param {Partial<utils.AdapterOptions>} [options={}]
     */
    module.exports = (options) => new alarmcontrol(options);
} else {
    // otherwise start the instance directly
    new alarmcontrol();
}