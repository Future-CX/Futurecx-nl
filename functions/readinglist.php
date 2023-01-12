<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $post_title = "";                //   "title": "Going from Architect to Architecting: the Evolution of a Key Role",
    $post_link = "";                 //   "link": "https://www.infoq.com/articles/architecture-architecting-role/",
    $post_category = "";             //   "category": "Enterprise Architecture",
    $post_contenttype = "";          //   "contenttype": "article",
    $post_description = "";          //   "description": "This article explores the cultural change of moving towards shared architecture",
    $post_author = "";               //   "author": "InfoQ",
    $post_date = "";                 //   "date": "Dec 12, 2022"


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // STEP 1: Process posted data
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    $data = json_decode(file_get_contents('php://input'), true);

    foreach ($data as $key => $value) {
        switch ($key) {
            case "title":
                $post_title = $value;
                break;
            case "link":
                $post_link = $value;
                break;
            case "category":
                $post_category = $value;
                break;
            case "contenttype":
                $post_contenttype = $value;
                break;
            case "description":
                $post_description = $value;
                break;
            case "author":
                $post_author = $value;
                break;
            case "date":
                $post_date = $value;
                break;
        }
    }

    $postdata = array(
          array(
                "title" => $post_title, 
                "link" => $post_link, 
                "category" => $post_category, 
                "contenttype" => $post_contenttype, 
                "description" => $post_description, 
                "author" => $post_author, 
                "date" => $post_date               
        )
    );
    $postdata = array("items" => $postdata);
    //echo json_encode($postdata);
    
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // STEP 2: Read existing list
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
    // Get the contents of the JSON file 
    $existingReadinglist = file_get_contents($_SERVER['DOCUMENT_ROOT'] . '/data/readinglist.json');
    
    
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // STEP 3: Test if url not exist already
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    // UPDATE or ADD


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // STEP 4a: Create updated list
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
    // Create a backup
    $date = date('Y-m-d', time());
    copy($_SERVER['DOCUMENT_ROOT'] . '/data/readinglist.json', $_SERVER['DOCUMENT_ROOT'] . '/data/archive/readinglist-'.$date.'.json');
    
    // Convert to array 
    $existingJSON = json_decode($existingReadinglist, true);
    //echo json_encode($existingJSON);

    // Merge posted date with existing list
    $newJSON = array_merge($postdata["items"], $existingJSON["items"]);
    $newJSON = array("items" => $newJSON);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // STEP 5: Reorder based on date
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // STEP 6: Store new list to server
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Store updated list to server
    file_put_contents($_SERVER['DOCUMENT_ROOT'] . '/data/readinglist.json', json_encode($newJSON));


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // STEP 7: Commit to Github
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



    
    // return the update list as json
    echo json_encode($newJSON);
}
?>