import { SPFI } from "@pnp/sp";
import { getSP } from "../../../pnpjsConfig";
import { IServeyWebpartProps } from "./IServeyWebpartProps";
import { useCallback, useState } from "react";
import { DefaultButton, IDropdownOption, Label, MessageBarType, Stack, StackItem } from "@fluentui/react";
import { ISurvey } from "../../../interface";
import { MessageBarComponent } from "./List/MessageBarComponent";
import * as React from "react";
import { SkillsComponent } from "./List/SkillComponent";
import { DOBComponent } from "./List/DOBComponent";
import { RatingComponent } from "./List/RatingComponent";
import { LatestEntryComponent } from "./List/LatestEntryComponent";

const ServeyWebpart = (props: IServeyWebpartProps) => {
    const LIST_NAME = 'Survey';
    let _sp: SPFI = getSP(props.context);

    const [dateOfBirth, setDateOfBirth] = useState<Date>();
    const [ratingNum, setRatingNum] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [age, setAge] = useState<number>();
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [customSkill, setCustomSkill] = useState<string>('');
    const [message, setMessage] = useState<{ text: string, type: MessageBarType } | null>(null);
    const [latestEntry, setLatestEntry] = useState<ISurvey | null>(null);

    const skillsList: IDropdownOption[] = [
        { key: 'HTML', text: 'HTML' },
        { key: 'CSS', text: 'CSS' },
        { key: 'JavaScript', text: 'JavaScript' }
    ];

    const today: Date = new Date();

    const calculateAge = useCallback((newDate: Date) => {
        const today = new Date();
        let age = today.getFullYear() - newDate.getFullYear();
        const monthDiff = today.getMonth() - newDate.getMonth();
        const dayDiff = today.getDate() - newDate.getDate();
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
        }
        setAge(age);
    }, []);

    const handleDateChange = (newDate: Date | null | undefined) => {
        setDateOfBirth(newDate || undefined);
        if (newDate) {
            calculateAge(newDate);
        }
    };

    const handleRatingChange = (_event: React.FormEvent<HTMLElement>, rating?: number) => {
        setRatingNum(rating ? rating : 0);
    };

    const handleSkillChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
        if (option) {
            const newSelectedSkills = selectedSkills.indexOf(option.key as string) !== -1
                ? selectedSkills.filter(skill => skill !== option.key)
                : [...selectedSkills, option.key as string];

            setSelectedSkills(newSelectedSkills);
        }
    };

    const handleCustomSkillsChange = (_event: React.FormEvent<HTMLInputElement>, newValue?: string) => {
        setCustomSkill(newValue || '');
    };

    const saveToSharePoint = async () => {
        try {
            const items = await _sp.web.lists.getByTitle(LIST_NAME).items.select('Index').orderBy('Index', false).top(1)();
            const highestIndex = items.length > 0 ? items[0].Index : 0;
            const newIndex = highestIndex + 1;

            const finalSkills: string[] = [...selectedSkills];
            if (customSkill) {
                const customSkillsArray = customSkill.split(',').map(skill => skill.trim()).filter(skill => skill !== '');
                finalSkills.push(...customSkillsArray);
            }

            await _sp.web.lists.getByTitle(LIST_NAME).items.add({
                Index: newIndex,
                Fullname: props.userDisplayName,
                Email: props.userDisplayEmail,
                DOB: dateOfBirth,
                Age: age,
                RatingSurvey: ratingNum,
                Skills: finalSkills
            });

            const latestItems = await _sp.web.lists.getByTitle(LIST_NAME).items.filter(`Index eq '${newIndex}'`)();
            if (latestItems.length > 0) {
                const item = latestItems[0];
                item.DOB = new Date(item.DOB);
                setLatestEntry(item as ISurvey);
            }

            setMessage({ text: 'Data saved successfully!', type: MessageBarType.success });
            setCurrentPage(5);
        } catch (error) {
            console.error('Error saving data:', error);
            setMessage({ text: 'Error saving data!', type: MessageBarType.error });
        }
    };

    const handleSubmit = () => {
        if (selectedSkills.length === 0 && !customSkill) {
            setMessage({ text: 'Please select at least one skill or enter custom skills!', type: MessageBarType.warning });
            return;
        }
        saveToSharePoint();
    };

    return (
        <Stack>
            <MessageBarComponent message={message} />
            {currentPage === 1 && (
                <StackItem>
                    <Label>Page 1:</Label>
                    <Label>Selection Question</Label>
                    <DefaultButton onClick={() => setCurrentPage(2)}>Question 2</DefaultButton>
                    <DefaultButton onClick={() => setCurrentPage(3)}>Question 3</DefaultButton>
                </StackItem>
            )}
            {currentPage === 2 && (
                <StackItem><SkillsComponent
                    skillsList={skillsList}
                    selectedSkills={selectedSkills}
                    handleSkillChange={handleSkillChange}
                    customSkill={customSkill}
                    handleCustomSkillsChange={handleCustomSkillsChange} /><DefaultButton onClick={() => setCurrentPage(1)}>Back to Question 1</DefaultButton></StackItem>
            )}
            {currentPage === 3 && (
                <StackItem>
                    <DOBComponent
                        dateOfBirth={dateOfBirth}
                        handleDateChange={handleDateChange}
                        age={age}
                        today={today} />
                    <DefaultButton onClick={() => setCurrentPage(1)}>Back to Question 1</DefaultButton>
                    <DefaultButton onClick={() => setCurrentPage(4)}>Back to Question 4</DefaultButton>
                </StackItem>
            )}
            {currentPage === 4 && (
                <StackItem>
                    <RatingComponent handleRatingChange={handleRatingChange} />
                    <DefaultButton onClick={() => setCurrentPage(1)}>Back to Question 1</DefaultButton>
                    <DefaultButton onClick={handleSubmit}>Submit</DefaultButton>
                </StackItem>
            )}
            {currentPage === 5 && (
                <LatestEntryComponent latestEntry={latestEntry} />
            )}

        </Stack>
    );
};

export default ServeyWebpart;
