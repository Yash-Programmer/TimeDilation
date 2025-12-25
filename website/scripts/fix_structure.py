import json

input_file = 'src/data/modules.json'

try:
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"Loaded data. Processing {len(data['modules'])} levels...")

    for level in data['modules']:
        print(f"Processing level: {level.get('level')}")
        for chapter in level['items']:
            new_subs = []
            for sub in chapter['subtopics']:
                # Check if it's a list (was a tuple in python script)
                if isinstance(sub, list):
                    # Ensure we have 4 elements
                    if len(sub) >= 4:
                        sid, title, stype, payload = sub[0], sub[1], sub[2], sub[3]
                        
                        obj = {
                            "id": sid,
                            "title": title,
                            "type": stype
                        }
                        
                        # Map payload to correct field
                        if stype == 'quiz':
                            obj['quiz'] = payload
                        elif stype == 'flashcard':
                            obj['flashcard'] = payload
                        else:
                            obj['content'] = payload # text, case_study, task
                            
                        new_subs.append(obj)
                    else:
                        print(f"Skipping malformed subtopic in {chapter['title']}: {sub}")
                else:
                    new_subs.append(sub) # Already an object
            chapter['subtopics'] = new_subs

    with open(input_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

    print("Success: Fixed JSON structure. Subtopics are now objects.")

except Exception as e:
    print(f"Error: {e}")
