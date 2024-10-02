import { DatePicker, DefaultButton, Dropdown, IDropdownOption, Label, Rating, RatingSize, Stack, StackItem, MessageBar, MessageBarType, TextField } from '@fluentui/react';
import { SPFI } from '@pnp/sp';
import * as React from 'react';
import { useState, useCallback } from 'react';
import { getSP } from '../../../pnpjsConfig';
import { IServeyWebpartProps } from './IServeyWebpartProps';
import { ISurvey } from '../../../interface';
import { Badge } from "@fluentui/react-components";


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
    const [latestEntry, setLatestEntry] = useState<ISurvey | null>(null); // State to store the latest entry

    const skillsList: IDropdownOption[] = [
        { key: 'HTML', text: 'HTML' },
        { key: 'CSS', text: 'CSS' },
        { key: 'JavaScript', text: 'JavaScript' }
    ];

    const today: Date = new Date();

    const formatDate = (date: Date | null | undefined): string => {
        if (!date) return '';
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
    };
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

            console.log("Selected Skills:", selectedSkills);

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

            // Fetch the latest entry to display
            const latestItems = await _sp.web.lists.getByTitle(LIST_NAME).items.filter(`Index eq '${newIndex}'`)();
            if (latestItems.length > 0) {
                const item = latestItems[0];
                // Manually convert DOB to Date if it's a string
                item.DOB = new Date(item.DOB); // Convert to Date object
                setLatestEntry(item as ISurvey);
            }

            setMessage({ text: 'Data saved successfully!', type: MessageBarType.success });
            setCurrentPage(5); // Move to Page 5 to display the latest entry
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
            {message && (
                <MessageBar messageBarType={message.type}>
                    {message.text}
                </MessageBar>
            )}
            {currentPage === 1 && (
                <StackItem>
                    <Label>Page 1:</Label>
                    <Label>Selection Question</Label>
                    <DefaultButton onClick={() => setCurrentPage(2)}>Question 2</DefaultButton>
                    <DefaultButton onClick={() => setCurrentPage(3)}>Question 3</DefaultButton>
                </StackItem>
            )}
            {currentPage === 2 && (
                <StackItem>
                    <Label>Page 2: Skills Question</Label>
                    <Label>Question: What skills do you have?</Label>
                    <Dropdown
                        placeholder="Select skills"
                        options={skillsList}
                        multiSelect
                        selectedKeys={selectedSkills}
                        onChange={handleSkillChange}
                    />
                    <TextField
                        label="Please specify custom skills (comma separated)"
                        value={customSkill}
                        onChange={handleCustomSkillsChange}
                    />
                    <DefaultButton onClick={() => setCurrentPage(1)}>Question 1</DefaultButton>
                    <DefaultButton onClick={() => setCurrentPage(3)}>Question 3</DefaultButton>
                </StackItem>
            )}
            {currentPage === 3 && (
                <StackItem>
                    <Label>Page 3: First Question</Label>
                    <Label>Question: What is your date of birth?</Label>
                    <DatePicker
                        onSelectDate={handleDateChange}
                        maxDate={today}
                        formatDate={formatDate}
                        value={dateOfBirth}
                        placeholder="Select a date"
                    />
                    {age !== undefined && (
                        <Label>Your age: {age} {age === 1 ? 'year' : 'years'}</Label>
                    )}
                    <DefaultButton onClick={() => setCurrentPage(1)}>Question 1</DefaultButton>
                    <DefaultButton onClick={() => setCurrentPage(4)}>Question 4</DefaultButton>
                </StackItem>
            )}
            {currentPage === 4 && (
                <StackItem>
                    <Label>Page 4: Rate Us</Label>
                    <Label>Please rate us on a scale of 1 to 5 stars:</Label>
                    <Rating
                        min={1}
                        max={5}
                        onChange={handleRatingChange}
                        size={RatingSize.Large}
                    />
                    <DefaultButton onClick={() => setCurrentPage(1)}>Question 1</DefaultButton>
                    <DefaultButton onClick={handleSubmit}>Submit</DefaultButton>
                </StackItem>
            )}
            {currentPage === 5 && latestEntry && (
                <StackItem>
                    <Label>Page 5: Latest Entry Details</Label>
                    <Label>Index: {latestEntry.Index}</Label>
                    <Label>Fullname: {latestEntry.Fullname}</Label>
                    <Label>Email: {latestEntry.Email}</Label>
                    DOB: {latestEntry.DOB ? latestEntry.DOB.toLocaleDateString('en-GB') : 'N/A'}
                    <Label>Age: {latestEntry.Age}</Label>
                    <Label>Rating Survey: {latestEntry.RatingSurvey}</Label>
                    <Stack horizontal tokens={{ childrenGap: 10 }} >
                        {Array.isArray(latestEntry.Skills) && latestEntry.Skills.length > 0 ? (
                            latestEntry.Skills.map((skill, index) => (
                                <Badge key={index} appearance="filled">
                                    {skill}
                                </Badge>
                            ))
                        ) : (
                            <Badge appearance="outline">No skills selected</Badge>
                        )}
                    </Stack>
                </StackItem>
            )}
        </Stack>
    );
};

export default ServeyWebpart;
