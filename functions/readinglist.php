<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $post_title = "";                //   "title": "Going from Architect to Architecting: the Evolution of a Key Role",
    $post_link = "";                 //   "link": "https://www.infoq.com/articles/architecture-architecting-role/",
    $post_image = "";                //   "image": "https://cdn.nos.nl/image/2022/12/25/928822/1024x576a.jpg",
    $post_category = "";             //   "category": "Enterprise Architecture",
    $post_contenttype = "";          //   "contenttype": "article",
    $post_description = "";          //   "description": "This article explores the cultural change of moving towards shared architecture",
    $post_review = "";               //   "review": "I really like this article",
    $post_author = "";               //   "author": "InfoQ",
    $post_postdate = "";             //   "date": "Dec 12, 2022"
    $post_savedate = date('M d, Y', time());             //   "date": "Dec 12, 2022"
    $post_meta = "";                 //   <meta>*. </meta>


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // STEP 1a: Process posted data
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
            case "image":
                $post_image = $value;
                break;
            case "category":
                $post_category = $value;
                break;
            case "contenttype":
                $post_contenttype = strtolower($value);
                break;
            case "description":
                $post_description = $value;
                break;
            case "review":
                $post_review = $value;
                break;
            case "author":
                $post_author = $value;
                break;
            case "postdate":
                $post_postdate = $value;
                break;
            case "savedate":
                $post_savedate = $value;
                break;
            case "meta":
                $post_meta = $value;
                break;
        }
    }


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // STEP 1b: Digest META tags
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    // $allMetaTags = GetMetatagsFromUrl($post_link);
    $allMetaTags = GetMetatagsFromUrl($post_link);

    //echo '<pre>'; print_r($allMetaTags); echo '</pre>';

    if (empty($post_title) && array_key_exists("title", $allMetaTags) ) {
        $post_title = $allMetaTags['title']['content'];
    }
    if (empty($post_description) && array_key_exists("description", $allMetaTags) ) {                                   
        $post_description = $allMetaTags['description']['content'];  
    }
    if (empty($post_image) && array_key_exists("og:image", $allMetaTags) ) {                                   
        $post_image = $allMetaTags['og:image']['content'];  
    }
    if (empty($post_image) && array_key_exists("thumbnail", $allMetaTags) ) {                                   
        $post_image = $allMetaTags['thumbnail']['content'];  
    }
    if (empty($post_author) && array_key_exists("author", $allMetaTags) ) {                                   
        $post_author = $allMetaTags['author']['content'];  
    }
    if (empty($post_author) && array_key_exists("twitter:site", $allMetaTags) ) {                                   
        $post_author = ltrim($allMetaTags['twitter:site']['content'], '@');;  
    }
    if (empty($post_postdate) && array_key_exists("og:article:published_time", $allMetaTags) ) {                                   
        $post_postdate = $allMetaTags['og:article:published_time']['content'];
        
        // TODO reformat date
        //$post_postdate = date('M d, Y', $post_postdate); 
    }       

    
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // STEP 2: Build new Array
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    
    $postdata = array(
          array(
                "title" => $post_title, 
                "link" => $post_link,
                "image" => $post_image,
                "category" => $post_category, 
                "contenttype" => $post_contenttype, 
                "description" => $post_description,
                "review" => $post_review, 
                "author" => $post_author, 
                "postdate" => $post_postdate,
                "savedate" => $post_savedate            
        )
    );
    $postdata = array("items" => $postdata);
    
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // STEP 3: Read existing list
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
    // Get the contents of the JSON file 
    $existingReadinglist = file_get_contents($_SERVER['DOCUMENT_ROOT'] . '/data/readinglist.json');
    
    
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // STEP 4: Test if url not exist already
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    // UPDATE or ADD


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // STEP 5a: Create updated list
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
    // Create a backup
    $date = date('Y-m-d', time());
    copy($_SERVER['DOCUMENT_ROOT'] . '/data/readinglist.json', $_SERVER['DOCUMENT_ROOT'] . '/data/archive/readinglist-'.$date.'.json');
    
    // Convert to array 
    $existingJSON = json_decode($existingReadinglist, true);

    // Merge posted date with existing list
    $newJSON = array_merge($postdata["items"], $existingJSON["items"]);
    $newJSON = array("items" => $newJSON);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // STEP 6: Reorder based on date
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // STEP 7: Store new list to server
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Send email
    SendMail($newJSON);
    
    // Store updated list to server
    //file_put_contents($_SERVER['DOCUMENT_ROOT'] . '/data/readinglist.json', json_encode($newJSON));


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // STEP 8: Commit to Github
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



    
    // return the update list as json
    echo json_encode($newJSON);
}


function SendMail($postdata){
    $date = date('m/d/Y h:i:s a', time());   
    $headers = "MIME-Version: 1.0" . "\r\n"; 
	$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n"; 
	// Additional headers 
	$headers .= 'From: Future CX<webmaster@futurecx.nl>' . "\r\n"; 
	//$headers .= 'Cc: welcome@example.com' . "\r\n"; 
	//$headers .= 'Bcc: welcome2@example.com' . "\r\n"; 
	$to      = 'm.van.deel@futurecx.nl';
    $subject = 'PostTest at ' . $date;
	$message = '<html><head><title>Future CX Post Test</title></head><body>';
	$message .= '<h2>JSON BODY</h2>';
	$data = json_decode(file_get_contents('php://input'), true);
	$message .= "<pre>";
	$message .= json_encode($postdata, JSON_PRETTY_PRINT);
	$message .= "</pre>";
    $message .= "</body></html>";
    mail($to, $subject, $message, $headers);
}

function GetMetatagsFromUrl($url){
    $html = getUrlContents($url);

    $dom = new DOMDocument;
    $dom->loadHTML($html);
    
    $metaTags = array();
    
    foreach ($dom->getElementsByTagName('meta') as $tag) {
        // if ($tag->getAttribute('property') === 'og:image') {
        //     echo $tag->getAttribute('content');
        // }
        $nameOrProperty = $tag->getAttribute('name');
        if($nameOrProperty == ""){
            $nameOrProperty = $tag->getAttribute('property');
        }
        
        $metaTag = array( "name" => $nameOrProperty, "content" => $tag->getAttribute('content'), );
        
        //array_push($metaTags, $metaTag);

        if($nameOrProperty != ""){
            $metaTags[$nameOrProperty] = $metaTag;
        }
        
        

    }
    //print_r($metaTags);
    return $metaTags;

}

function getUrlContents($url, $maximumRedirections = null, $currentRedirection = 0)
{
    $result = false;
  
    $contents = @file_get_contents($url);
  
    // Check if we need to go somewhere else
  
    if (isset($contents) && is_string($contents))
    {
        preg_match_all('/<[\s]*meta[\s]*http-equiv="?REFRESH"?' . '[\s]*content="?[0-9]*;[\s]*URL[\s]*=[\s]*([^>"]*)"?' . '[\s]*[\/]?[\s]*>/si', $contents, $match);
      
        if (isset($match) && is_array($match) && count($match) == 2 && count($match[1]) == 1)
        {
            if (!isset($maximumRedirections) || $currentRedirection < $maximumRedirections)
            {
                return getUrlContents($match[1][0], $maximumRedirections, ++$currentRedirection);
            }
          
            $result = false;
        }
        else
        {
            $result = $contents;
        }
    }
  
    return $contents;
}

?>