<?php

define("SOURCE_DIR", "src");
define("DIST_DIR", "dist");
define("BABELRC", '{"presets": ["env", "es2015", "react", "stage-2"]}');

$packageJson = '{
  "name": "uiex",
  "version": "0.0.7",
  "description": "UI library",
  "repository": {
    "type": "git",
    "url": "https://github.com/bushstas/uiex"
  },
  "author": {
    "name": "Bushmakin Stas",
    "email": "bushstas@mail.ru"
  },
  "dependencies": {
    "state-master": "^1.0.0"
  }
}';

function copyr($source, $dest) {
    // Check for symlinks
    if (is_link($source)) {
        return symlink(readlink($source), $dest);
    }
    
    // Simple copy for a file
    if (is_file($source)) {
        return copy($source, $dest);
    }

    // Make destination directory
    if (!is_dir($dest)) {
        mkdir($dest);
    }

    // Loop through the folder
    $dir = dir($source);
    while (false !== $entry = $dir->read()) {
        // Skip pointers
        if ($entry == '.' || $entry == '..') {
            continue;
        }

        // Deep copy directories
        copyr("$source/$entry", "$dest/$entry");
    }

    // Clean up
    $dir->close();
    return true;
}

function deleteDir($dirPath) {
    if (! is_dir($dirPath)) {
        throw new InvalidArgumentException("$dirPath must be a directory");
    }
    if (substr($dirPath, strlen($dirPath) - 1, 1) != '/') {
        $dirPath .= '/';
    }
    $files = glob($dirPath . '*', GLOB_MARK);
    foreach ($files as $file) {
        if (is_dir($file)) {
            deleteDir($file);
        } else {
            unlink($file);
        }
    }
    rmdir($dirPath);
}


if (is_dir("./output")) {
	deleteDir("./output");
}
mkdir("./output");

file_put_contents(__DIR__."/output/package.json", $packageJson);

$cssFiles = array();
$jsFiles = array();
$fontsDirs = array();
function getFolders($path, &$paths, &$paths2, &$paths3) {
	$dirs = array_filter(glob($path.'/*'), 'is_dir');
	foreach ($dirs as $dir) {
		$name = preg_replace("/^\.\/src\//", '', $dir);
		if (preg_match("/^[A-Z]/", $name)) {
			if (file_exists($dir."/style.scss")) {
				$paths[$name] = $dir."/style.scss";
			}
			if (file_exists($dir."/index.js")) {
				$paths2[$name] = $dir."/index.js";
			}
			if (is_dir($dir.'/fonts')) {
				$paths3[$name] = $dir.'/fonts';
			}
			getFolders($dir, $paths, $paths2, $paths3);
		}
	}
}
getFolders('./src', $cssFiles, $jsFiles, $fontsDirs);


if (!file_exists('.babelrc')) {
	file_put_contents(__DIR__."/.babelrc", BABELRC);
}

if (!is_dir('./node_modules')) {
	file_put_contents(__DIR__."/.babelrc", BABELRC);
	
	$packageJsonForBuild = '{
	  "name": "uiex"
	}';
	file_put_contents(__DIR__."/package.json", $packageJsonForBuild);
	

	$presets = array('env', 'react', 'es2015', 'stage-2');
	foreach ($presets as $preset) {
		exec("npm i babel-preset-".$preset." --save-dev 2>&1", $output, $return_var);
		print("<pre>");
		print_r($output);
		print("</pre>");
	}
}

exec("babel src -d output 2>&1", $output, $return_var);

foreach ($cssFiles as $folder => $path) {
	$path2 = str_replace('/src/', '/output/', $path);
	$path2 = str_replace('.scss', '.css', $path2);
	exec("sass ".$path." ".$path2." --no-source-map");
}
$commonCssFiles = array('style.scss');
foreach ($commonCssFiles as $file) {
	$file2 = str_replace('.scss', '.css', $file);
	exec("sass ./src/".$file." ./output/".$file2." --no-source-map");
}

foreach ($jsFiles as $path) {
	$path = str_replace('/src/', '/output/', $path);
	$content = file_get_contents($path);
	$content = str_replace('.scss', '.css', $content);
	file_put_contents($path, $content);
}

foreach ($fontsDirs as $path) {
	$path2 = str_replace('/src/', '/output/', $path);
	copyr($path, $path2);
}

print("<pre>");
print_r($cssFiles);
print("</pre>");